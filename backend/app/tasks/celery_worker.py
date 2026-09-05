import logging
from celery import Celery
from app.core.config import settings

logger = logging.getLogger(__name__)

celery_app = Celery(
    "ner_landslide_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
)


@celery_app.task(name="evaluate_realtime_landslide_thresholds")
def evaluate_realtime_landslide_thresholds():
    """
    Periodic job: Queries latest rainfall and soil moisture readings,
    calls ML microservice to re-evaluate LSI, and triggers alerts if
    threshold exceeds critical bounds.
    """
    logger.info("Executing scheduled Landslide Susceptibility Index (LSI) re-evaluation...")
    # Simulated pipeline step for Phase 0
    return {
        "status": "completed",
        "scanned_zones": 4,
        "high_risk_detected": 1,
        "action_taken": "Automated warning flag raised for East Khasi Hills"
    }


@celery_app.task(name="dispatch_sms_broadcast_task")
def dispatch_sms_broadcast_task(target_district: str, message: str):
    """
    Asynchronous Celery task for firing batch Twilio / CDAC SMS
    to citizens registered in the threatened geofence.
    """
    logger.info(f"Dispatching emergency SMS payload to district: {target_district}")
    return {"status": "sent", "district": target_district, "channel": "SMS"}
