from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class EmergencyAlertBase(BaseModel):
    title: str
    description: str
    risk_level: str
    state: str
    district: str
    evacuation_routes_advised: Optional[str] = None


class EmergencyAlertCreate(EmergencyAlertBase):
    pass


class EmergencyAlertResponse(EmergencyAlertBase):
    id: int
    broadcasted_sms: int
    broadcasted_push: int
    created_at: datetime
    is_active: int

    class Config:
        from_attributes = True


class BroadcastRequest(BaseModel):
    alert_id: Optional[int] = None
    title: str
    message: str
    target_district: str
    channels: list[str] = ["sms", "push"]
