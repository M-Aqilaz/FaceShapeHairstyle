import numpy as np
from skimage.feature import hog

from backend.app.config import (
    HOG_CELLS_PER_BLOCK,
    HOG_ORIENTATIONS,
    HOG_PIXELS_PER_CELL,
)


def extract_hog_features(image_array: np.ndarray) -> np.ndarray:
    """
    Extracts Histogram of Oriented Gradients (HOG) features from a 2D grayscale image.
    Returns:
        1D numpy array containing the extracted HOG feature descriptors.
    """
    features = hog(
        image_array,
        orientations=HOG_ORIENTATIONS,
        pixels_per_cell=HOG_PIXELS_PER_CELL,
        cells_per_block=HOG_CELLS_PER_BLOCK,
        block_norm="L2-Hys",
        visualize=False,
        transform_sqrt=True,
    )
    return np.asarray(features, dtype=np.float32)
