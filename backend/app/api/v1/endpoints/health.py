from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("", summary="System Health & Status")
async def check_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0-sih2026",
        "modules": {
            "postgis": "connected_or_mock_ready",
            "redis_celery": "configured",
            "ml_engine": settings.ML_ENGINE_URL,
            "mock_mode": True
        }
    }
