import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.api.routes import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("face_shape_api")

app = FastAPI(
    title="FaceShape Hairstyle Backend API",
    description="Backend API untuk Klasifikasi Bentuk Wajah (HOG + SVM) dan Rekomendasi Gaya Rambut.",
    version="1.0.0",
)

# CORS Middleware for Frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)


@app.get("/", tags=["Root"])
def root_status():
    return {
        "status": "online",
        "message": "FaceShape Hairstyle Backend API berjalan.",
        "docs_url": "/docs",
        "health_check": "/api/health",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "Terjadi kesalahan internal pada server backend.",
            "detail": str(exc),
        },
    )
