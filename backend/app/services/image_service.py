import io
import logging
from pathlib import Path
from typing import Tuple
import numpy as np
from PIL import Image, UnidentifiedImageError
from fastapi import HTTPException, UploadFile, status

from backend.app.config import (
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    IMAGE_TARGET_SIZE,
    MAX_FILE_SIZE,
    MODELS_DIR,
)

logger = logging.getLogger("face_shape_api.image_service")

# Inisialisasi MediaPipe FaceLandmarker (Tasks API)
_FACE_LANDMARKER = None
_LANDMARKER_TASK_PATH = MODELS_DIR / "face_landmarker.task"
try:
    import mediapipe as mp
    from mediapipe.tasks import python as mp_python
    from mediapipe.tasks.python import vision as mp_vision

    if _LANDMARKER_TASK_PATH.exists():
        _base_opts = mp_python.BaseOptions(model_asset_path=str(_LANDMARKER_TASK_PATH))
        _opts = mp_vision.FaceLandmarkerOptions(
            base_options=_base_opts,
            num_faces=1,
            min_face_detection_confidence=0.5,
        )
        _FACE_LANDMARKER = mp_vision.FaceLandmarker.create_from_options(_opts)
        logger.info("MediaPipe FaceLandmarker (478 landmark) berhasil diinisialisasi.")
    else:
        logger.warning(f"Model FaceLandmarker tidak ditemukan di {_LANDMARKER_TASK_PATH}")
except Exception as e:
    logger.warning(f"MediaPipe FaceLandmarker tidak aktif / belum terpasang: {e}")


def crop_face_with_mediapipe(image: Image.Image, padding: float = 0.20) -> Image.Image:
    """
    Mendeteksi area wajah menggunakan 478 landmark MediaPipe FaceLandmarker dan melakukan
    auto-crop bujur sangkar 1:1 dengan margin ~20% agar dahi, tulang pipi, dan dagu tetap utuh.
    Jika tidak ada wajah terdeteksi, otomatis fallback ke center-crop 1:1.
    """
    w, h = image.size
    global _FACE_LANDMARKER
    if _FACE_LANDMARKER is not None:
        try:
            rgb_arr = np.array(image.convert("RGB"))
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_arr)
            results = _FACE_LANDMARKER.detect(mp_image)
            if results and results.face_landmarks:
                landmarks = results.face_landmarks[0]
                x_coords = [lm.x * w for lm in landmarks]
                y_coords = [lm.y * h for lm in landmarks]

                xmin, xmax = min(x_coords), max(x_coords)
                ymin, ymax = min(y_coords), max(y_coords)

                bw = xmax - xmin
                bh = ymax - ymin

                cx = xmin + bw / 2.0
                cy = ymin + bh / 2.0
                sq_size = max(bw, bh) * (1.0 + padding * 2)

                crop_x1 = max(0, int(cx - sq_size / 2.0))
                crop_y1 = max(0, int(cy - sq_size / 2.0))
                crop_x2 = min(w, int(cx + sq_size / 2.0))
                crop_y2 = min(h, int(cy + sq_size / 2.0))

                if crop_x2 > crop_x1 and crop_y2 > crop_y1:
                    return image.crop((crop_x1, crop_y1, crop_x2, crop_y2))
        except Exception as exc:
            logger.warning(f"MediaPipe detection error: {exc}. Menggunakan center-crop fallback.")

    # Fallback: center-crop 1:1 bujur sangkar
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    return image.crop((left, top, left + min_dim, top + min_dim))


def validate_file(file: UploadFile, content: bytes) -> None:
    """
    Validates file presence, size, extension, and MIME type.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nama file tidak valid atau kosong.",
        )

    # Size check
    file_size = len(content)
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File yang diunggah kosong.",
        )
    if file_size > MAX_FILE_SIZE:
        max_mb = MAX_FILE_SIZE / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Ukuran file ({file_size / (1024 * 1024):.1f} MB) melebihi batas maksimum {max_mb:.0f} MB.",
        )

    # Extension check
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ekstensi file '{ext}' tidak didukung. Ekstensi yang diizinkan: {allowed}.",
        )

    # MIME type check
    content_type = file.content_type or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES:
        allowed_mime = ", ".join(sorted(ALLOWED_MIME_TYPES))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipe konten '{content_type}' tidak diizinkan. Tipe yang diizinkan: {allowed_mime}.",
        )


def process_image(content: bytes) -> Tuple[np.ndarray, Tuple[int, int]]:
    """
    Reads image bytes with PIL, converts to grayscale and resizes to target shape.
    Returns:
        (grayscale_normalized_array, original_dimensions)
    """
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verify integrity
    except (UnidentifiedImageError, Exception) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format file gambar rusak atau tidak dapat dibaca.",
        ) from exc

    # Re-open after verify() (PIL requires re-open after verify)
    image = Image.open(io.BytesIO(content))
    orig_size = image.size  # (width, height)

    # 1. Deteksi Wajah & Auto-Crop bujur sangkar dengan MediaPipe (fallback ke center-crop)
    cropped_face = crop_face_with_mediapipe(image)

    # 2. Convert to Grayscale
    gray_image = cropped_face.convert("L")

    # 3. Resize to standardized target size for HOG extraction (128x128)
    resized_image = gray_image.resize(IMAGE_TARGET_SIZE, Image.Resampling.LANCZOS)
    gray_arr = np.array(resized_image, dtype=np.uint8)

    # 4. Adaptive Contrast Enhancement (CLAHE)
    # Menyeimbangkan kontras lokal untuk mengatasi foto gelap / backlight,
    # sehingga gradien tepi tulang pipi, dahi, dan garis rahang tetap terdefinisi jelas bagi HOG.
    try:
        import cv2
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced_arr = clahe.apply(gray_arr)
    except Exception as exc:
        logger.warning(f"Gagal menerapkan CLAHE: {exc}. Menggunakan grayscale standar.")
        enhanced_arr = gray_arr

    img_array = enhanced_arr.astype(np.float32) / 255.0

    return img_array, orig_size
