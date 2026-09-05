import datetime
import enum
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text, Boolean
from geoalchemy2 import Geometry
from app.core.database import Base


class RiskLevelEnum(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    SEVERE = "SEVERE"


class LandslideRiskZone(Base):
    __tablename__ = "landslide_risk_zones"

    id = Column(Integer, primary_key=True, index=True)
    zone_code = Column(String(50), unique=True, index=True)
    state = Column(String(50), nullable=False)
    district = Column(String(100), nullable=False)
    risk_level = Column(Enum(RiskLevelEnum), default=RiskLevelEnum.LOW)
    susceptibility_score = Column(Float, default=0.0)
    slope_degrees = Column(Float, default=0.0)
    antecedent_rainfall_72h = Column(Float, default=0.0)
    last_evaluated_at = Column(DateTime, default=datetime.datetime.utcnow)
    geom = Column(Geometry(geometry_type="POLYGON", srid=4326), nullable=True)


class LandslideRiskPoint(Base):
    __tablename__ = "landslide_risk_points"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    rainfall_24h = Column(Float, default=0.0)
    rainfall_48h = Column(Float, default=0.0)
    soil_moisture = Column(Float, default=0.0)
    slope = Column(Float, default=0.0)
    elevation = Column(Float, default=0.0)
    land_use = Column(String(100), default="Degraded Forest")
    distance_to_road = Column(Float, default=0.0)
    historical_landslide = Column(Integer, default=0)
    state = Column(String(50), default="NER")
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)


class RoadNetworkSegment(Base):
    __tablename__ = "road_network_segments"

    id = Column(Integer, primary_key=True, index=True)
    segment_code = Column(String(50), unique=True, index=True)
    highway_name = Column(String(100), nullable=False) # e.g. NH-10, NH-106
    from_node = Column(String(100), nullable=False)
    to_node = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    status = Column(String(50), default="OPERATIONAL") # OPERATIONAL | HIGH_RISK | BLOCKED
    risk_score = Column(Float, default=0.0)
    detour_advisory = Column(Text, nullable=True)
    geom = Column(Geometry(geometry_type="LINESTRING", srid=4326), nullable=True)


class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id = Column(Integer, primary_key=True, index=True)
    reporter_name = Column(String(100), default="Anonymous Citizen")
    reporter_phone = Column(String(20), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    state = Column(String(50), default="NER")
    district = Column(String(100), default="Hill Sector")
    hazard_type = Column(String(50), default="Slope Creep / Crack")
    severity_reported = Column(String(20), default="HIGH") # LOW | MODERATE | HIGH | SEVERE
    description = Column(Text, nullable=True)
    photo_url = Column(String(255), nullable=True)
    status = Column(String(30), default="PENDING_REVIEW") # PENDING_REVIEW | VERIFIED_TRUE_ALARM | DISMISSED_FALSE_ALARM
    reviewed_by_officer = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)


class OfficerUser(Base):
    __tablename__ = "officer_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    badge_id = Column(String(50), unique=True, nullable=False)
    agency = Column(String(100), default="State Disaster Management Authority (SDMA)")
    state = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)


class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(Enum(RiskLevelEnum), nullable=False)
    state = Column(String(50), nullable=False)
    district = Column(String(100), nullable=False)
    evacuation_routes_advised = Column(Text, nullable=True)
    broadcasted_sms = Column(Integer, default=0)
    broadcasted_push = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Integer, default=1)


class SensorTelemetry(Base):
    __tablename__ = "sensor_telemetry"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String(100), index=True)
    sensor_type = Column(String(50))
    location_name = Column(String(150))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    reading_value = Column(Float, nullable=False)
    unit = Column(String(20))
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)


class AlertFeedbackLog(Base):
    __tablename__ = "alert_feedback_logs"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, nullable=True)
    alert_title = Column(String(200), nullable=True)
    feedback_type = Column(String(50), nullable=False)  # CONFIRMED | FALSE_ALARM | MISSED_EVENT
    officer_name = Column(String(100), nullable=False)
    officer_badge = Column(String(50), nullable=True)
    observed_rainfall_mm = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
