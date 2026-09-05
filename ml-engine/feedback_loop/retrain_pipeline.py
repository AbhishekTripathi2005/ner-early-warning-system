"""
Feedback Loop & Model Retraining Pipeline (Phase 2)
Incorporates verified field officer feedback:
- TRUE_POSITIVE: Correctly predicted landslide event.
- FALSE_ALARM: Predicted hazard but slope remained stable.
- MISSED_INCIDENT: Unpredicted slope failure reported by citizen or field crew.
Appends verified ground truth to the training repository and triggers automated model fine-tuning.
"""
import os
import datetime
import pandas as pd
from typing import Dict, Any, List


class FieldFeedbackRetrainer:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.feedback_log_path = os.path.join(base_dir, "field_officer_feedback.csv")
        self.dataset_path = os.path.join(base_dir, "..", "data", "synthetic_landslide_ner_dataset.csv")

    def record_feedback(self, officer_id: str, feedback_type: str, features: Dict[str, Any], notes: str = "") -> Dict[str, Any]:
        """
        Logs officer verification and appends ground truth to dataset.
        feedback_type in: ["TRUE_POSITIVE", "FALSE_ALARM", "MISSED_INCIDENT"]
        """
        # Determine actual label
        # TRUE_POSITIVE -> label 1
        # FALSE_ALARM   -> label 0 (penalty correction)
        # MISSED_INCIDENT -> label 1 (failure correction)
        actual_label = 0 if feedback_type.upper() == "FALSE_ALARM" else 1

        record = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "officer_id": officer_id,
            "feedback_type": feedback_type.upper(),
            "actual_label": actual_label,
            "lat": float(features.get("lat", 25.5)),
            "lon": float(features.get("lon", 91.8)),
            "rainfall_24h": float(features.get("rainfall_24h", 50.0)),
            "rainfall_48h": float(features.get("rainfall_48h", 90.0)),
            "soil_moisture": float(features.get("soil_moisture", 65.0)),
            "slope": float(features.get("slope", 30.0)),
            "elevation": float(features.get("elevation", 1200.0)),
            "land_use": features.get("land_use", "Degraded Forest"),
            "distance_to_road": float(features.get("distance_to_road", 300.0)),
            "notes": notes
        }

        # Append to feedback audit log
        df_new = pd.DataFrame([record])
        if os.path.exists(self.feedback_log_path):
            df_new.to_csv(self.feedback_log_path, mode='a', header=False, index=False)
        else:
            df_new.to_csv(self.feedback_log_path, index=False)

        # Append corrected row to active dataset
        dataset_row = {
            "lat": record["lat"],
            "lon": record["lon"],
            "rainfall_24h": record["rainfall_24h"],
            "rainfall_48h": record["rainfall_48h"],
            "soil_moisture": record["soil_moisture"],
            "slope": record["slope"],
            "elevation": record["elevation"],
            "land_use": record["land_use"],
            "distance_to_road": record["distance_to_road"],
            "historical_landslide": actual_label,
            "state": features.get("state", "Meghalaya")
        }
        if os.path.exists(self.dataset_path):
            pd.DataFrame([dataset_row]).to_csv(self.dataset_path, mode='a', header=False, index=False)

        return {
            "status": "feedback_recorded",
            "feedback_type": feedback_type.upper(),
            "actual_label_assigned": actual_label,
            "training_sample_appended": True
        }

    def trigger_retraining(self, trigger_source: str = "MANUAL") -> Dict[str, Any]:
        """
        Executes model retraining pipeline on updated dataset.
        Callable via manual admin trigger or scheduled cron.
        """
        try:
            from ml_engine.baseline.train_baseline import train_baseline_models
        except ImportError:
            import sys
            sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
            from baseline.train_baseline import train_baseline_models

        report = train_baseline_models()
        return {
            "status": "retraining_complete",
            "trigger_source": trigger_source,
            "completed_at": datetime.datetime.utcnow().isoformat(),
            "new_metrics": report.get("evaluation_summary", {})
        }
