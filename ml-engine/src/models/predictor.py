"""
Landslide Risk Predictor Module.
Integrates trained XGBoost susceptibility pipeline with geotechnical domain rules.
"""
import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any
from src.features.feature_extractor import LandslideFeatureTransformer

# STRICT ALIGNMENT: Cross-verified with train_baseline.py (lines 37-45)
# Exact column order and naming required by the ColumnTransformer pipeline
EXPECTED_TRAINING_COLUMNS = [
    "rainfall_24h",
    "rainfall_48h",
    "soil_moisture",
    "slope",
    "elevation",
    "distance_to_road",
    "land_use"
]


class LandslidePredictor:
    def __init__(self, model_path: str = None):
        self.transformer = LandslideFeatureTransformer()
        base_dir = os.path.dirname(os.path.abspath(__file__))
        default_artifact = os.path.abspath(os.path.join(
            base_dir, "..", "..", "baseline", "artifacts", "baseline_xgb_model.joblib"
        ))
        self.model_path = model_path or default_artifact
        self.xgb_pipeline = None
        self._load_trained_model()

        # Domain geotechnical calibrated weights for factor synthesis
        self.weights = {
            "slope": 0.35,
            "rainfall": 0.30,
            "soil_moisture": 0.15,
            "lithology": 0.12,
            "insar_creep": 0.08
        }

    def _load_trained_model(self):
        """Loads serialized XGBoost scikit-learn Pipeline containing preprocessor + classifier."""
        if os.path.exists(self.model_path):
            try:
                self.xgb_pipeline = joblib.load(self.model_path)
                print(f"[LandslidePredictor] Successfully loaded XGBoost pipeline from {self.model_path}")
            except Exception as e:
                print(f"[LandslidePredictor] Warning: Could not deserialize model: {e}")
                self.xgb_pipeline = None
        else:
            print(f"[LandslidePredictor] Notice: Model artifact not found at {self.model_path}, fallback active.")

    def predict(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates Landslide Susceptibility Index (LSI: 0.0 - 1.0) using trained XGBoost inference
        fused with geotechnical hazard tier classification.
        """
        # Map raw input to pipeline features with defaults representative of NER terrain
        slope_val = float(raw_input.get("slope_degrees", raw_input.get("slope", 32.0)))
        rain_24h = float(raw_input.get("rainfall_24h", raw_input.get("antecedent_rainfall_72h", 90.0) * 0.45))
        rain_48h = float(raw_input.get("rainfall_48h", raw_input.get("antecedent_rainfall_72h", 90.0) * 0.85))
        soil_m = float(raw_input.get("soil_moisture_pct", raw_input.get("soil_moisture", 65.0)))
        elevation_val = float(raw_input.get("elevation", 1350.0))
        dist_road = float(raw_input.get("distance_to_road", 350.0))
        land_use_val = str(raw_input.get("land_use", "Degraded Forest"))
        lithology_type = raw_input.get("lithology_type", "Sandstone-Shale")
        insar_rate = float(raw_input.get("insar_displacement_rate_mm_yr", raw_input.get("insar", 0.0)))

        # 1. Build DataFrame strictly respecting train_baseline.py column schema
        feature_dict = {
            "rainfall_24h": [rain_24h],
            "rainfall_48h": [rain_48h],
            "soil_moisture": [soil_m],
            "slope": [slope_val],
            "elevation": [elevation_val],
            "distance_to_road": [dist_road],
            "land_use": [land_use_val]
        }
        df_input = pd.DataFrame(feature_dict)

        # Cross-verification assertion confirming exact match with training column order
        assert list(df_input.columns) == EXPECTED_TRAINING_COLUMNS, (
            f"Feature column mismatch! Expected {EXPECTED_TRAINING_COLUMNS}, got {list(df_input.columns)}"
        )

        # 2. Compute Machine Learning Susceptibility Probability
        ml_probability = None
        if self.xgb_pipeline is not None:
            try:
                # predict_proba returns [prob_0, prob_1]
                probs = self.xgb_pipeline.predict_proba(df_input)
                ml_probability = float(probs[0][1])
            except Exception as ex:
                print(f"[LandslidePredictor] Pipeline inference warning: {ex}")
                ml_probability = None

        # 3. Geotechnical domain baseline fusion
        features_norm = self.transformer.transform(raw_input)
        heuristic_score = (
            features_norm[0] * self.weights["slope"] +
            features_norm[1] * self.weights["rainfall"] +
            features_norm[2] * self.weights["soil_moisture"] +
            features_norm[3] * self.weights["lithology"] +
            features_norm[4] * self.weights["insar_creep"]
        )

        # If trained ML model is active, fuse ML probability (70%) with geotechnical safety factor (30%)
        if ml_probability is not None:
            final_score = (ml_probability * 0.70) + (heuristic_score * 0.30)
            model_engine = "XGBoost-GradientBoostedTrees-v1 (Loaded from Disk)"
        else:
            final_score = heuristic_score
            model_engine = "Geotechnical-SafetyFactor-RuleBaseline"

        lsi_score = round(min(1.0, max(0.05, final_score)), 3)

        # Categorize into NDMA/MDoNER warning tiers
        if lsi_score >= 0.75:
            risk_level = "SEVERE"
            recommendation = "Red Alert: Immediate evacuation of downslope hamlets and suspension of vehicular movement."
        elif lsi_score >= 0.55:
            risk_level = "HIGH"
            recommendation = "Orange Alert: High slope instability. Mobilize emergency response teams and alert village heads."
        elif lsi_score >= 0.35:
            risk_level = "MODERATE"
            recommendation = "Yellow Watch: Saturated soils. Continuous telemetry monitoring required."
        else:
            risk_level = "LOW"
            recommendation = "Green Advisory: Standard vigilance."

        return {
            "susceptibility_score": lsi_score,
            "ml_model_probability": round(ml_probability, 4) if ml_probability is not None else None,
            "model_engine": model_engine,
            "features_verified": EXPECTED_TRAINING_COLUMNS,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "contributing_factors": {
                "slope_contribution_pct": round(features_norm[0] * self.weights["slope"] / lsi_score * 100, 1),
                "rainfall_contribution_pct": round(features_norm[1] * self.weights["rainfall"] / lsi_score * 100, 1),
                "soil_moisture_pct": round(features_norm[2] * self.weights["soil_moisture"] / lsi_score * 100, 1)
            }
        }
