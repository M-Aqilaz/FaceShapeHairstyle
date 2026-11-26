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
)

logger = logging.getLogger("face_shape_api.image_service")

# Inisialisasi MediaPipe Face Detection
_FACE_DETECTOR = None
try:
    import mediapipe as mp
    mp_face = mp.solutions.face_detection
    _FACE_DETECTOR = mp_face.FaceDetection(model_selection=1, min_detection_confidence=0.5)
    logger.info("MediaPipe Face Detection berhasil diinisialisasi.")
except Exception as e:
    logger.warning(f"MediaPipe Face Detection tidak aktif / belum terpasang: {e}")


def crop_face_with_mediapipe(image: Image.Image) -> Image.Image:
    """
    Mendeteksi area wajah menggunakan MediaPipe dan melakukan auto-crop bujur sangkar 1:1
    dengan margin ~25% agar garis rambut dan rahang tetap utuh.
    Jika tidak ada wajah terdeteksi, otomatis fallback ke center-crop 1:1.
    """
    w, h = image.size
    global _FACE_DETECTOR
    if _FACE_DETECTOR is not None:
        try:
            rgb_arr = np.array(image.convert("RGB"))
            results = _FACE_DETECTOR.process(rgb_arr)
            if results and results.detections:
                # Ambil deteksi wajah dengan ukuran bounding box terbesar
                best = max(
                    results.detections,
                    key=lambda d: d.location_data.relative_bounding_box.width
                    * d.location_data.relative_bounding_box.height,
                )
                bbox = best.location_data.relative_bounding_box

                # Konversi relatif ke koordinat piksel
                bx = int(bbox.xmin * w)
                by = int(bbox.ymin * h)
                bw = int(bbox.width * w)
                bh = int(bbox.height * h)

                # Margin 25% agar mencakup hairline dan kontur rahang bawah
                pad_x = int(bw * 0.25)
                pad_y = int(bh * 0.25)

                x1 = max(0, bx - pad_x)
                y1 = max(0, by - pad_y)
                x2 = min(w, bx + bw + pad_x)
                y2 = min(h, by + bh + pad_y)

                # Buat potongan bujur sangkar 1:1 berpusat pada wajah
                cx = (x1 + x2) // 2
                cy = (y1 + y2) // 2
                sq_size = max(x2 - x1, y2 - y1)

                crop_x1 = max(0, cx - sq_size // 2)
                crop_y1 = max(0, cy - sq_size // 2)
                crop_x2 = min(w, crop_x1 + sq_size)
                crop_y2 = min(h, crop_y1 + sq_size)

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
    img_array = np.array(resized_image, dtype=np.float32) / 255.0

    return img_array, orig_size
