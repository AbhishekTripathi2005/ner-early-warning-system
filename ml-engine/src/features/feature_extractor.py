"""
Feature engineering and normalization pipeline for Landslide Susceptibility Assessment.
Transforms raw environmental variables into machine learning input vectors.
"""
from typing import Dict, Any, List


class LandslideFeatureTransformer:
    def __init__(self):
        self.lithology_risk_weights = {
            "Sandstone-Shale": 0.85, # Highly susceptible to shearing
            "Schist-Gneiss": 0.70,   # Moderate to high foliated weakness
            "Limestone": 0.50,       # Karst & dissolution
            "Alluvium": 0.40         # Low slope, prone to debris flow only
        }

    def transform(self, raw_input: Dict[str, Any]) -> List[float]:
        """
        Transforms dictionary of inputs into normalized ML feature vector:
        [norm_slope, norm_rainfall, norm_soil_moisture, lithology_weight, insar_displacement_norm]
        """
        slope = float(raw_input.get("slope_degrees", 25.0))
        rainfall_72h = float(raw_input.get("antecedent_rainfall_72h", 50.0))
        soil_moisture = float(raw_input.get("soil_moisture_pct", 50.0))
        lithology = raw_input.get("lithology_type", "Sandstone-Shale")
        insar_rate = float(raw_input.get("insar_displacement_rate_mm_yr", 0.0))

        # Normalization heuristics tailored to NER conditions
        norm_slope = min(1.0, max(0.0, slope / 60.0))
        norm_rainfall = min(1.0, max(0.0, rainfall_72h / 300.0))
        norm_soil = min(1.0, max(0.0, soil_moisture / 100.0))
        lith_weight = self.lithology_risk_weights.get(lithology, 0.60)
        norm_creep = min(1.0, max(0.0, abs(insar_rate) / 30.0))

        return [norm_slope, norm_rainfall, norm_soil, lith_weight, norm_creep]
