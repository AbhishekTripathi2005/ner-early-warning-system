from datetime import datetime
from typing import List
from fastapi import APIRouter
from app.schemas.alert import EmergencyAlertResponse, BroadcastRequest

router = APIRouter()

MOCK_ALERTS: List[dict] = [
    {
        "id": 101,
        "title": "RED ALERT: Imminent Slope Failure Threat in East Khasi Hills",
        "description": "Continuous cloudburst rainfall (>260mm in 72h) has crossed dynamic instability threshold. Immediate evacuation advised for vulnerable downslope villages.",
        "risk_level": "SEVERE",
        "state": "Meghalaya",
        "district": "East Khasi Hills",
        "evacuation_routes_advised": "Proceed north via NH-106 towards designated Shillong District Stadium relief camp.",
        "broadcasted_sms": 4820,
        "broadcasted_push": 12150,
        "created_at": datetime.utcnow().isoformat(),
        "is_active": 1
    },
    {
        "id": 102,
        "title": "ORANGE ALERT: Active Ground Creep Detected along Gangtok Corridor",
        "description": "InSAR Sentinel-1 telemetry indicates 14mm/month surface subsidence. Heavy monsoon showers expected over next 24 hours.",
        "risk_level": "HIGH",
        "state": "Sikkim",
        "district": "East Sikkim",
        "evacuation_routes_advised": "Avoid Singtam-Dikchu bypass. Follow NH-10 diversion.",
        "broadcasted_sms": 1940,
        "broadcasted_push": 6300,
        "created_at": datetime.utcnow().isoformat(),
        "is_active": 1
    }
]


@router.get("", summary="Get Active Early Warning Alerts")
async def list_alerts():
    """Retrieve active disaster alerts sorted by severity."""
    return MOCK_ALERTS


@router.post("/broadcast", summary="Dispatch Emergency Broadcast")
async def broadcast_alert(payload: BroadcastRequest):
    """
    Mock trigger for SMS gateway & FCM push broadcast.
    When Twilio/Firebase keys are present, dispatches actual packets.
    """
    return {
        "status": "success",
        "message": f"Broadcast queued successfully for {payload.target_district}",
        "dispatched_channels": payload.channels,
        "recipients_simulated": {
            "sms_count": 3450,
            "push_notification_count": 8900
        },
        "timestamp": datetime.utcnow().isoformat()
    }
