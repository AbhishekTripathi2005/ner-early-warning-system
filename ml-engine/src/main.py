"""
FastAPI Microservice for AI/ML Inference & Early Warning (Phase 1 & Phase 2)
Exposes:
- /predict/susceptibility (Static ML susceptibility + SHAP Hindi/English explanation)
- /predict/nowcast (PyTorch LSTM 2-6 hour short term + 24-48h weather forecast risk)
- /predict/road-impact (Graph Neural network road-network risk propagation)
- /feedback (Field officer verification logger)
- /retrain (Automated / manual retraining trigger)
"""
import sys
import os
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Ensure root paths are resolvable
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from susceptibility.susceptibility_model import StaticSusceptibilityModel
from nowcast.lstm_nowcast import DynamicNowcaster
from nowcast.forecast_model import WeatherForecastRiskModel
from spatiotemporal.road_network_graph import RoadNetworkRiskPropagator
from explainability.shap_explainer import LandslideSHAPExplainer
from explainability.natural_language_explainer import NaturalLanguageExplainer
from feedback_loop.retrain_pipeline import FieldFeedbackRetrainer

app = FastAPI(
    title="NER Landslide Hybrid AI Prediction Engine",
    description="Microservice providing multi-scale Landslide Susceptibility, LSTM Nowcasting, Graph Road Impact, and SHAP Multilingual Explainability for SIH 2026.",
    version="2.0.0"
)

# Initialize Engine Components
susceptibility_model = StaticSusceptibilityModel()
nowcaster = DynamicNowcaster()
forecast_engine = WeatherForecastRiskModel()
road_graph = RoadNetworkRiskPropagator()
shap_explainer = LandslideSHAPExplainer()
nl_explainer = NaturalLanguageExplainer()
feedback_retrainer = FieldFeedbackRetrainer()


# Request Schemas
class SusceptibilityRequest(BaseModel):
    rainfall_24h: float = Field(default=45.0, example=65.0)
    rainfall_48h: float = Field(default=90.0, example=180.0)
    soil_moisture: float = Field(default=65.0, example=88.0)
    slope: float = Field(default=35.0, example=44.0)
    elevation: float = Field(default=1200.0, example=1480.0)
    distance_to_road: float = Field(default=300.0, example=85.0)
    land_use: str = Field(default="Degraded Forest", example="Barren Land / Quarry")
    location_name: Optional[str] = Field(default="East Khasi Hills Sector", example="Cherrapunji Hills")


class NowcastRequest(BaseModel):
    hourly_sequence: Optional[List[List[float]]] = Field(
        default=None,
        description="6-hour sequence: [[hourly_rain_mm, soil_saturation_pct], ...]"
    )
    forecast_24h_mm: float = Field(default=60.0, example=85.0)
    forecast_48h_mm: float = Field(default=110.0, example=140.0)
    current_soil_moisture_pct: float = Field(default=78.0, example=86.0)
    slope_deg: float = Field(default=36.0, example=42.0)


class RoadImpactRequest(BaseModel):
    custom_triggers: Optional[Dict[str, float]] = Field(
        default=None,
        description="Optional custom segment triggers, e.g. {'Singtam-Gangtok Capital': 0.88}"
    )


class FeedbackRequest(BaseModel):
    officer_id: str = Field(..., example="SDRF-OFFICER-04")
    feedback_type: str = Field(..., example="TRUE_POSITIVE", description="TRUE_POSITIVE | FALSE_ALARM | MISSED_INCIDENT")
    features: Dict[str, Any]
    notes: Optional[str] = "Observed 30m debris flow along road cut"


@app.get("/")
def root():
    return {
        "service": "NER Landslide Hybrid AI Prediction Engine",
        "version": "2.0.0",
        "endpoints": [
            "/predict/susceptibility",
            "/predict/nowcast",
            "/predict/road-impact",
            "/feedback",
            "/retrain"
        ],
        "status": "online"
    }


@app.post("/predict/susceptibility", summary="Static Susceptibility + SHAP Explainability (Hindi & English)")
def predict_susceptibility(payload: SusceptibilityRequest):
    """
    Computes static Landslide Susceptibility Index (LSI) with SHAP feature attributions
    and human-interpretable explanations in Hindi and English.
    """
    input_dict = payload.model_dump()
    location = input_dict.pop("location_name", "Sector")

    # 1. Inference
    res = susceptibility_model.predict_susceptibility(input_dict)

    # 2. SHAP Attribution
    shap_res = shap_explainer.explain_instance(input_dict)

    # 3. Multilingual Explainability
    nl_res = nl_explainer.explain(input_dict, shap_res, location_name=location)

    return {
        "susceptibility_score": res["susceptibility_score"],
        "hazard_tier": res["hazard_tier"],
        "recommended_action": res["recommended_action"],
        "shap_attributions": shap_res["shap_attributions"],
        "top_risk_accelerators": shap_res["top_risk_accelerators"],
        "explanation": {
            "hindi": nl_res["explanation_hindi"],
            "english": nl_res["explanation_english"]
        }
    }


@app.post("/predict/nowcast", summary="Dynamic Nowcast (2-6h LSTM + 24-48h Weather Forecast)")
def predict_nowcast(payload: NowcastRequest):
    """
    Predicts:
    1. 2-6 hour short-term rapid slope failure risk using PyTorch LSTM
    2. 24-48 hour medium-term hazard risk using weather forecast loading index
    """
    nowcast_2_6h = nowcaster.predict_2_6h_risk(payload.hourly_sequence)
    forecast_24_48h = forecast_engine.evaluate_forecast(
        forecast_24h_mm=payload.forecast_24h_mm,
        forecast_48h_mm=payload.forecast_48h_mm,
        current_soil_pct=payload.current_soil_moisture_pct,
        slope=payload.slope_deg
    )

    return {
        "short_term_nowcast_2_6h": nowcast_2_6h,
        "medium_term_forecast_24_48h": forecast_24_48h,
        "overall_urgency": "EVACUATE_IMMEDIATELY" if nowcast_2_6h["nowcast_score_2_6h"] > 0.75 else "PREEMPTIVE_PREPARATION"
    }


@app.post("/predict/road-impact", summary="Spatiotemporal Road Network Risk Propagation")
def predict_road_impact(payload: RoadImpactRequest):
    """
    Simulates hazard propagation across NER road lifelines (NH-10, NH-106, NH-6)
    and reports isolated settlements and blocked highway links.
    """
    return road_graph.propagate_risk_and_assess_impact()


@app.post("/feedback", summary="Log Field Officer Label Verification")
def submit_feedback(payload: FeedbackRequest):
    """
    Logs field ground-truth labels (True Positive / False Alarm / Missed Incident)
    and appends to the active training set.
    """
    return feedback_retrainer.record_feedback(
        officer_id=payload.officer_id,
        feedback_type=payload.feedback_type,
        features=payload.features,
        notes=payload.notes or ""
    )


@app.post("/retrain", summary="Trigger Automated / Manual Model Retraining")
def trigger_retrain(trigger_source: str = "MANUAL_OFFICER"):
    """Executes retraining pipeline over newly labeled ground-truth observations."""
    return feedback_retrainer.trigger_retraining(trigger_source=trigger_source)
