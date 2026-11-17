import io
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

    # Convert to RGB then Grayscale
    if image.mode != "RGB":
        image = image.convert("RGB")
    gray_image = image.convert("L")

    # Resize to standardized target size for HOG extraction
    resized_image = gray_image.resize(IMAGE_TARGET_SIZE, Image.Resampling.LANCZOS)
    img_array = np.array(resized_image, dtype=np.float32) / 255.0

    return img_array, orig_size
