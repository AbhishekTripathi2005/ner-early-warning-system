"""
LSTM Nowcasting Training Module (PyTorch)
Trains a 2-layer LSTM on synthetic multi-step time-series sensor sequences for 2-6h slope failure nowcasting.
Saves weights artifact to artifacts/lstm_nowcast_weights.pt
"""
import os
import torch
import torch.nn as nn
import numpy as np

# Ensure deterministic generation
torch.manual_seed(42)
np.random.seed(42)

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
        out, (hn, cn) = self.lstm(x)
        last_out = out[:, -1, :]
        return self.fc(last_out)


def generate_synthetic_sequences(num_samples: int = 600, seq_len: int = 6):
    """
    Generates 6-hour sequences of [rainfall_mm_hr, soil_saturation_pct].
    Positive failure label (1) triggered when cumulative rainfall surge and soil saturation exceed threshold.
    """
    X = []
    y = []

    for _ in range(num_samples):
        # Base rainfall pattern with random hourly progression
        base_rain = np.random.uniform(2.0, 30.0)
        surge = np.random.choice([True, False], p=[0.45, 0.55])

        seq = []
        rain = base_rain
        soil = np.random.uniform(40.0, 75.0)

        for t in range(seq_len):
            if surge:
                rain += np.random.uniform(4.0, 12.0)
                soil = min(98.0, soil + np.random.uniform(3.0, 6.0))
            else:
                rain = max(0.5, rain + np.random.uniform(-3.0, 3.0))
                soil = min(80.0, max(30.0, soil + np.random.uniform(-1.5, 2.0)))
            seq.append([rain, soil])

        # Ground truth rule for training
        final_rain = seq[-1][0]
        final_soil = seq[-1][1]
        is_failure = 1.0 if (final_rain > 35.0 and final_soil > 82.0) or (final_soil > 92.0 and final_rain > 25.0) else 0.0

        X.append(seq)
        y.append([is_failure])

    # Normalize inputs: rain / 100.0, soil / 100.0
    X_arr = np.array(X, dtype=np.float32) / 100.0
    y_arr = np.array(y, dtype=np.float32)

    return torch.tensor(X_arr), torch.tensor(y_arr)


def train_and_save_lstm():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    artifacts_dir = os.path.join(base_dir, "artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)
    weights_path = os.path.join(artifacts_dir, "lstm_nowcast_weights.pt")

    print("[LSTM Train] Generating synthetic time-series sequences...")
    X_train, y_train = generate_synthetic_sequences(num_samples=700, seq_len=6)

    model = LandslideLSTM(input_size=2, hidden_size=32, num_layers=2)
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.005)

    print("[LSTM Train] Training PyTorch LSTM Nowcaster...")
    model.train()
    epochs = 40
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(X_train)
        loss = criterion(outputs, y_train)
        loss.backward()
        optimizer.step()

        if (epoch + 1) % 10 == 0 or epoch == 0:
            preds = (outputs > 0.5).float()
            acc = (preds == y_train).float().mean()
            print(f"  Epoch {epoch+1}/{epochs} | Loss: {loss.item():.4f} | Acc: {acc.item()*100:.1f}%")

    # Save trained state_dict weights
    torch.save(model.state_dict(), weights_path)
    print(f"[LSTM Train] Successfully saved trained weights to {weights_path}")
    return weights_path


if __name__ == "__main__":
    train_and_save_lstm()
