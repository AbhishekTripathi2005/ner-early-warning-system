from datetime import datetime
from fastapi import APIRouter

router = APIRouter()

MOCK_SENSORS = [
    {
        "sensor_id": "IMD-AWS-CHERRA-01",
        "sensor_type": "optical_rain_gauge",
        "location_name": "Cherrapunji Observatory, Meghalaya",
        "latitude": 25.27,
        "longitude": 91.73,
        "current_value": 38.4,
        "unit": "mm/hr",
        "status": "CRITICAL_HIGH",
        "battery_pct": 98,
        "last_ping": datetime.utcnow().isoformat()
    },
    {
        "sensor_id": "IOT-PIEZO-GANGTOK-04",
        "sensor_type": "piezometer_pore_pressure",
        "location_name": "Singtam Hill Base, Sikkim",
        "latitude": 27.23,
        "longitude": 88.50,
        "current_value": 74.2,
        "unit": "kPa",
        "status": "WARNING",
        "battery_pct": 89,
        "last_ping": datetime.utcnow().isoformat()
    },
    {
        "sensor_id": "IOT-INCLINO-HAFLONG-02",
        "sensor_type": "tilt_inclinometer",
        "location_name": "Haflong Cutting Zone, Assam",
        "latitude": 25.17,
        "longitude": 93.02,
        "current_value": 4.8,
        "unit": "degrees_tilt",
        "status": "NORMAL",
        "battery_pct": 94,
        "last_ping": datetime.utcnow().isoformat()
    }
]


@router.get("", summary="Get IoT & AWS Sensor Telemetry")
async def get_sensor_telemetry():
    """Returns IoT telemetry from deployed hill sensors across the region."""
    return {
        "count": len(MOCK_SENSORS),
        "sensors": MOCK_SENSORS
    }
