import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

TRAINED_MODEL_FILE_PATH = MODELS_DIR / "trained_face_shape_svm.pkl"
MODEL_FILE_PATH = (
    TRAINED_MODEL_FILE_PATH
    if TRAINED_MODEL_FILE_PATH.exists()
    else MODELS_DIR / "face_shape_svm.pkl"
)

# Upload and Validation Rules
MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}

# Preprocessing & HOG Feature Extraction
IMAGE_TARGET_SIZE = (128, 128)
HOG_ORIENTATIONS = 9
HOG_PIXELS_PER_CELL = (8, 8)
HOG_CELLS_PER_BLOCK = (2, 2)

# Face shape classes
CLASSES = ["diamond", "heart", "oblong", "oval", "round", "square"]
