from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel


class RiskZoneBase(BaseModel):
    zone_code: str
    state: str
    district: str
    risk_level: str
    susceptibility_score: float
    slope_degrees: float
    antecedent_rainfall_72h: float


class RiskZoneResponse(RiskZoneBase):
    id: int
    last_evaluated_at: datetime

    class Config:
        from_attributes = True


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[GeoJSONFeature]
