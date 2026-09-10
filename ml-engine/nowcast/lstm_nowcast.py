"""
PyTorch LSTM Nowcasting Model (Phase 2)
Predicts 2-6 hour short-term rapid slope failure risk from time-series rainfall & soil moisture sequences.
Loads trained weights from artifacts/lstm_nowcast_weights.pt.
"""
import os
import torch
import torch.nn as nn
from typing import List, Dict, Any


class LandslideLSTM(nn.Module):
    def __init__(self, input_size: int = 2, hidden_size: int = 32, num_layers: int = 2):
        super(LandslideLSTM, self).__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.15
        )
        self.fc = nn.Sequential(
            nn.Linear(hidden_size, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (batch_size, seq_len, input_size)
        out, (hn, cn) = self.lstm(x)
        last_out = out[:, -1, :]
        prob = self.fc(last_out)
        return prob


class DynamicNowcaster:
    def __init__(self, weights_path: str = None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        default_path = os.path.join(base_dir, "artifacts", "lstm_nowcast_weights.pt")
        self.weights_path = weights_path or default_path
        
        self.model = LandslideLSTM(input_size=2, hidden_size=32, num_layers=2)
        self.is_trained_weights_loaded = False
        self._load_weights()
        self.model.eval()

    def _load_weights(self):
        if os.path.exists(self.weights_path):
            try:
                state_dict = torch.load(self.weights_path, map_location=torch.device("cpu"))
                self.model.load_state_dict(state_dict)
                self.is_trained_weights_loaded = True
                print(f"[DynamicNowcaster] Successfully loaded trained weights from {self.weights_path}")
            except Exception as e:
                print(f"[DynamicNowcaster] Warning loading weights: {e}. Fallback active.")
                self.is_trained_weights_loaded = False
        else:
            print(f"[DynamicNowcaster] No weights file at {self.weights_path}. Running with initialization.")

    def predict_2_6h_risk(self, sequence_rainfall_soil: List[List[float]] = None) -> Dict[str, Any]:
        """
        Takes 6-hour historical time-series:
        [ [hourly_rainfall_mm, soil_saturation_pct], ... (length 6) ]
        Outputs imminent 2-6 hour landslide probability.
        """
        if not sequence_rainfall_soil:
            # Default sequence: 6 hourly values showing escalating rainfall event in NER
            sequence_rainfall_soil = [
                [12.0, 75.0],
                [18.5, 79.0],
                [24.0, 83.0],
                [32.5, 88.0],
                [42.0, 92.5],
                [48.0, 96.0]
            ]

        tensor_in = torch.tensor([sequence_rainfall_soil], dtype=torch.float32)

        # Scale inputs (rainfall ~0-100 mm/h, soil moisture ~0-100 %)
        norm_tensor = tensor_in / 100.0

        with torch.no_grad():
            raw_neural_score = float(self.model(norm_tensor).item())

        # =========================================================================
        # HYDROLOGICAL SAFETY-CRITICAL OVERRIDE GUARD (Documented per Audit / PS)
        # Reason: In geotechnical disaster alerting, pure statistical sequence models
        # must have deterministic physical safeguards. Saturated hill soils (>85%)
        # undergoing cloudburst-intensity rainfall (>35mm/hr) will undergo liquefaction
        # regardless of earlier benign time steps.
        # =========================================================================
        recent_rain = sequence_rainfall_soil[-1][0]
        recent_soil = sequence_rainfall_soil[-1][1]
        
        is_hydrological_guard_triggered = False
        final_score = raw_neural_score

        if recent_rain > 35.0 and recent_soil > 85.0:
            final_score = max(raw_neural_score, 0.84)
            is_hydrological_guard_triggered = True
        elif recent_rain > 20.0 and recent_soil > 70.0:
            final_score = max(raw_neural_score, 0.60)
            is_hydrological_guard_triggered = True

        final_score = round(final_score, 3)

        if final_score >= 0.75:
            alert = "IMMINENT_COLLAPSE_WARNING"
            window = "2-3 Hours"
        elif final_score >= 0.50:
            alert = "HIGH_SURGE_RISK"
            window = "4-6 Hours"
        else:
            alert = "MONITORING_STEADY"
            window = "6+ Hours"

        return {
            "nowcast_score_2_6h": final_score,
            "raw_lstm_score": round(raw_neural_score, 4),
            "weights_loaded": self.is_trained_weights_loaded,
            "model_architecture": "PyTorch-2Layer-LSTM (input: 2, hidden: 32)",
            "hydrological_guard_active": is_hydrological_guard_triggered,
            "alert_status": alert,
            "expected_impact_window": window,
            "recent_intensity_mm_hr": recent_rain,
            "recent_soil_saturation_pct": recent_soil
        }


if __name__ == "__main__":
    nowcaster = DynamicNowcaster()
    res = nowcaster.predict_2_6h_risk()
    print("[DynamicNowcaster Test]", res)
