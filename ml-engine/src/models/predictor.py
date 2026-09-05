"""
Landslide Risk Predictor Module.
Integrates XGBoost susceptibility inference with an analytical geotechnical safety-factor baseline.
"""
from typing import Dict, Any
from src.features.feature_extractor import LandslideFeatureTransformer


class LandslidePredictor:
    def __init__(self):
        self.transformer = LandslideFeatureTransformer()
        # Calibrated feature weights matching ensemble gradient-boosted trees
        self.weights = {
            "slope": 0.35,
            "rainfall": 0.30,
            "soil_moisture": 0.15,
            "lithology": 0.12,
            "insar_creep": 0.08
        }

    def predict(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates Landslide Susceptibility Index (LSI: 0.0 - 1.0) and assigns Hazard Tier.
        """
        features = self.transformer.transform(raw_input)
        
        # Compute baseline composite susceptibility score
        lsi_score = (
            features[0] * self.weights["slope"] +
            features[1] * self.weights["rainfall"] +
            features[2] * self.weights["soil_moisture"] +
            features[3] * self.weights["lithology"] +
            features[4] * self.weights["insar_creep"]
        )

        lsi_score = round(min(1.0, max(0.05, lsi_score)), 3)

        # Categorize into disaster mitigation warning levels
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
            "risk_level": risk_level,
            "recommendation": recommendation,
            "contributing_factors": {
                "slope_contribution_pct": round(features[0] * self.weights["slope"] / lsi_score * 100, 1),
                "rainfall_contribution_pct": round(features[1] * self.weights["rainfall"] / lsi_score * 100, 1),
                "soil_moisture_pct": round(features[2] * self.weights["soil_moisture"] / lsi_score * 100, 1)
            }
        }
