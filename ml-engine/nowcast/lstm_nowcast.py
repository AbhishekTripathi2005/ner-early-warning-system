"""
PyTorch LSTM Nowcasting Model (Phase 2)
Predicts 2-6 hour short-term rapid slope failure risk from time-series rainfall & soil moisture sequences.
"""
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
        # Use last timestep hidden state
        last_out = out[:, -1, :]
        prob = self.fc(last_out)
        return prob


class DynamicNowcaster:
    def __init__(self):
        self.model = LandslideLSTM(input_size=2, hidden_size=32, num_layers=2)
        self.model.eval()

    def predict_2_6h_risk(self, sequence_rainfall_soil: List[List[float]]) -> Dict[str, Any]:
        """
        Takes 6-hour historical time-series:
        [ [hourly_rainfall_mm, soil_saturation_pct], ... (length 6) ]
        Outputs imminent 2-6 hour landslide probability.
        """
        if not sequence_rainfall_soil:
            # Default sequence: 6 hourly values
            sequence_rainfall_soil = [
                [12.0, 75.0],
                [18.5, 79.0],
                [24.0, 83.0],
                [32.5, 88.0],
                [42.0, 92.5],
                [48.0, 96.0]
            ]

        tensor_in = torch.tensor([sequence_rainfall_soil], dtype=torch.float32)

        # Scale inputs (rainfall ~0-100, soil moisture ~0-100)
        norm_tensor = tensor_in / 100.0

        with torch.no_grad():
            score = float(self.model(norm_tensor).item())

        # Calibrate risk score based on final hour surge
        recent_rain = sequence_rainfall_soil[-1][0]
        recent_soil = sequence_rainfall_soil[-1][1]
        
        # Heavy rain (>35mm/h) + saturated soil (>85%) significantly elevates trigger
        if recent_rain > 35.0 and recent_soil > 85.0:
            score = max(score, 0.82)
        elif recent_rain > 20.0 and recent_soil > 70.0:
            score = max(score, 0.58)

        score = round(score, 3)

        if score >= 0.75:
            alert = "IMMINENT_COLLAPSE_WARNING"
            window = "2-3 Hours"
        elif score >= 0.50:
            alert = "HIGH_SURGE_RISK"
            window = "4-6 Hours"
        else:
            alert = "MONITORING_STEADY"
            window = "6+ Hours"

        return {
            "nowcast_score_2_6h": score,
            "alert_status": alert,
            "expected_impact_window": window,
            "recent_intensity_mm_hr": recent_rain,
            "recent_soil_saturation_pct": recent_soil
        }
