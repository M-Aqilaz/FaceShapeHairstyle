from typing import Any, Dict
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from backend.app.services.feature_service import extract_hog_features
from backend.app.services.image_service import process_image, validate_file
from backend.app.services.model_service import get_model, predict_face_shape
from backend.app.services.recommendation_service import (
    get_recommendations_for_shape,
    get_shape_info,
    normalize_face_shape,
)

router = APIRouter(prefix="/api", tags=["API Endpoints"])


@router.get("/health")
def health_check() -> Dict[str, Any]:
    """
    Health check endpoint for checking backend status and model readiness.
    """
    model_ready = False
    try:
        model = get_model()
        model_ready = model is not None
    except Exception:
        pass

    return {
        "status": "ok",
        "service": "FaceShape Hairstyle Backend API",
        "model_ready": model_ready,
    }


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Validates and stores/inspects uploaded face image file.
    Deliverable for Week 13: Endpoint upload dan validasi file.
    """
    content = await file.read()
    validate_file(file, content)
    _, dimensions = process_image(content)

    return {
        "status": "success",
        "message": "File gambar berhasil diunggah dan lolos validasi.",
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(content),
        "dimensions": {"width": dimensions[0], "height": dimensions[1]},
    }


@router.post("/analysis/predict")
async def predict_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Full pipeline endpoint:
    1. Upload validation (Week 13)
    2. HOG feature extraction (Week 14)
    3. Model prediction (Week 14)
    4. Recommendations mapping (Week 14)
    """
    content = await file.read()
    validate_file(file, content)

    # 1. Image Preprocessing
    image_array, orig_dimensions = process_image(content)

    # 2. HOG Feature Extraction
    features = extract_hog_features(image_array)

    # 3. Model Classification
    prediction = predict_face_shape(features, orig_dimensions)
    face_shape = prediction["face_shape"]
    confidence = prediction["confidence"]

    # 4. Hair Recommendations Mapping
    shape_info = get_shape_info(face_shape) or {}
    recommendations = shape_info.get("recommendations", [])

    return {
        "face_shape": face_shape,
        "confidence": confidence,
        "label": shape_info.get("label", face_shape.capitalize()),
        "description": shape_info.get("description", ""),
        "traits": shape_info.get("traits", []),
        "recommendations": recommendations,
        "probabilities": prediction.get("probabilities", {}),
    }


@router.get("/recommendations/{face_shape}")
def get_recommendations(face_shape: str) -> Dict[str, Any]:
    """
    Returns hair style recommendations for a specific face shape.
    Deliverable for Week 14: Data rekomendasi untuk lima kategori dan sumber/aturan.
    """
    canonical_shape = normalize_face_shape(face_shape)
    shape_info = get_shape_info(canonical_shape)

    if not shape_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bentuk wajah '{face_shape}' tidak ditemukan. Pilihan yang tersedia: oval, round, square, heart, oblong.",
        )

    return {
        "face_shape": canonical_shape,
        "label": shape_info["label"],
        "blurb": shape_info.get("blurb", ""),
        "description": shape_info["description"],
        "traits": shape_info.get("traits", []),
        "recommendations": shape_info["recommendations"],
    }
