import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from backend.app.main import app

client = TestClient(app)


def create_dummy_image(width=200, height=200, color="gray", fmt="JPEG") -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["model_ready"] is True


def test_all_recommendations():
    shapes = ["oval", "round", "square", "heart", "oblong", "diamond"]
    for shape in shapes:
        res = client.get(f"/api/recommendations/{shape}")
        assert res.status_code == 200
        data = res.json()
        assert data["face_shape"] == shape
        assert len(data["recommendations"]) >= 3
        for rec in data["recommendations"]:
            assert "name" in rec
            assert "reason" in rec


def test_upload_image_valid():
    img_bytes = create_dummy_image()
    files = {"file": ("test_face.jpg", img_bytes, "image/jpeg")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["filename"] == "test_face.jpg"
    assert data["dimensions"]["width"] == 200


def test_upload_image_invalid_extension():
    files = {"file": ("script.sh", b"echo hello", "text/plain")}
    res = client.post("/api/upload", files=files)
    assert res.status_code == 400
    assert "Ekstensi" in res.json()["detail"]


def test_predict_pipeline():
    img_bytes = create_dummy_image(width=150, height=200)
    files = {"file": ("face_oval.png", img_bytes, "image/png")}
    res = client.post("/api/analysis/predict", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "face_shape" in data
    assert data["face_shape"] in ["oval", "round", "square", "heart", "oblong", "diamond"]
    assert 0.0 <= data["confidence"] <= 1.0
    assert len(data["recommendations"]) >= 1
    assert "label" in data
    assert "description" in data
