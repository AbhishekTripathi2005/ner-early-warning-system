from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    risk_zones,
    alerts,
    sensors,
    auth,
    risk_points,
    road_status,
    citizen_reports,
    historical
)

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Officer Authentication"])
api_router.include_router(risk_zones.router, prefix="/risk-zones", tags=["Landslide Risk Zones"])
api_router.include_router(risk_points.router, prefix="/risk-points", tags=["GIS Heatmap Risk Points"])
api_router.include_router(road_status.router, prefix="/road-status", tags=["Highway & Road Connectivity"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Early Warning Alerts"])
api_router.include_router(citizen_reports.router, prefix="/citizen-reports", tags=["Crowdsourced Citizen Reports"])
api_router.include_router(sensors.router, prefix="/sensors", tags=["IoT & Weather Sensors"])
api_router.include_router(historical.router, prefix="/historical", tags=["Historical Trends"])
