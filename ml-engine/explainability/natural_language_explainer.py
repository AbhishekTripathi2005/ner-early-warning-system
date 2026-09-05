"""
Natural Language Explainability Generator (Phase 2)
Translates quantitative SHAP values and hazard inputs into human-interpretable
early warning explanations in Hindi (हिन्दी) and English.
"""
from typing import Dict, Any


class NaturalLanguageExplainer:
    def explain(self, features: Dict[str, Any], shap_output: Dict[str, Any], location_name: str = "Sector") -> Dict[str, str]:
        """
        Synthesizes localized natural language explanations in Hindi and English.
        """
        rain_48 = features.get("rainfall_48h", 120.0)
        soil_pct = features.get("soil_moisture", 75.0)
        slope = features.get("slope", 38.0)
        land_use = features.get("land_use", "Degraded Forest")
        road_dist = features.get("distance_to_road", 150.0)

        top_factors = shap_output.get("top_risk_accelerators", ["rainfall_48h", "slope", "soil_moisture"])

        # Construct Hindi explanation
        hi_parts = []
        if "rainfall_48h" in top_factors or rain_48 > 100.0:
            hi_parts.append(f"pichle 48 ghanto ki bhaari baarish ({rain_48:.0f}mm)")
        if "soil_moisture" in top_factors or soil_pct > 75.0:
            hi_parts.append(f"mitti mein atyadhik nami / high soil moisture ({soil_pct:.0f}%)")
        if "slope" in top_factors or slope > 30.0:
            hi_parts.append(f"steep pahadi dhalan ({slope:.0f}°)")
        if road_dist < 200.0:
            hi_parts.append(f"sadak kataav ke kareeb hone ({road_dist:.0f}m)")

        hi_factors_joined = " + ".join(hi_parts) if hi_parts else "bhaugolik dhalan aur baarish ke asar"
        hindi_sentence = (
            f"{location_name} mein {hi_factors_joined} ki wajah se landslide risk HIGH hai. "
            f"Neechle ilaqon ke gaon ko satark rehne aur relief camp ki taraf move karne ki salah di jaati hai."
        )

        # Construct English explanation
        en_parts = []
        if "rainfall_48h" in top_factors or rain_48 > 100.0:
            en_parts.append(f"extreme 48-hour cumulative rainfall ({rain_48:.0f}mm)")
        if "soil_moisture" in top_factors or soil_pct > 75.0:
            en_parts.append(f"saturated pore-water soil moisture ({soil_pct:.0f}%)")
        if "slope" in top_factors or slope > 30.0:
            en_parts.append(f"steep terrain slope ({slope:.0f}°)")
        if road_dist < 200.0:
            en_parts.append(f"proximity to highway excavation cut ({road_dist:.0f}m)")

        en_factors_joined = " + ".join(en_parts) if en_parts else "unfavorable geomorphological & rain triggers"
        english_sentence = (
            f"High landslide risk in {location_name} driven primarily by {en_factors_joined}. "
            f"Preemptive evacuation of vulnerable downslope settlements advised."
        )

        return {
            "explanation_hindi": hindi_sentence,
            "explanation_english": english_sentence
        }
