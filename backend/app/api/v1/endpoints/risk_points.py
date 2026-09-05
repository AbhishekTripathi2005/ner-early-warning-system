import os
import pandas as pd
from typing import Optional
from fastapi import APIRouter

router = APIRouter()

# Path to the generated synthetic dataset
DATASET_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "..", "..", "..", "ml-engine", "data", "synthetic_landslide_ner_dataset.csv"
)


def load_dataset_features(limit: int = 400):
    """Loads records from CSV or produces robust in-memory fallback."""
    if os.path.exists(DATASET_PATH):
        df = pd.read_csv(DATASET_PATH)
        if limit:
            df = df.head(limit)
        return df.to_dict(orient="records")
    
    # Fallback points if CSV not reachable
    return [
        {"lat": 25.27, "lon": 91.73, "rainfall_24h": 68.0, "rainfall_48h": 185.0, "soil_moisture": 88.0, "slope": 44.0, "elevation": 1420.0, "historical_landslide": 1, "state": "Meghalaya"},
        {"lat": 27.33, "lon": 88.61, "rainfall_24h": 52.0, "rainfall_48h": 140.0, "soil_moisture": 82.0, "slope": 39.0, "elevation": 1650.0, "historical_landslide": 1, "state": "Sikkim"},
        {"lat": 25.18, "lon": 93.02, "rainfall_24h": 38.0, "rainfall_48h": 95.0, "soil_moisture": 74.0, "slope": 31.0, "elevation": 510.0, "historical_landslide": 0, "state": "Assam"},
        {"lat": 23.47, "lon": 93.32, "rainfall_24h": 22.0, "rainfall_48h": 45.0, "soil_moisture": 48.0, "slope": 26.0, "elevation": 920.0, "historical_landslide": 0, "state": "Mizoram"}
    ]


@router.get("", summary="Get GeoJSON Risk Points for Heatmap Layer")
async def get_risk_points(state: Optional[str] = None, limit: int = 500):
    """
    Returns point observations with spatial coordinates and normalized risk intensity (0.0 to 1.0)
    for rendering dynamic GIS heatmaps.
    """
    records = load_dataset_features(limit=limit)
    if state:
        records = [r for r in records if r.get("state", "").lower() == state.lower()]

    features = []
    for r in records:
        # Intensity formula combining slope, rainfall, soil moisture
        intensity = min(1.0, max(0.1, (r.get("slope", 20.0) / 60.0) * 0.45 + (r.get("soil_moisture", 50.0) / 100.0) * 0.35 + (r.get("rainfall_48h", 50.0) / 250.0) * 0.20))
        
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(r["lon"]), float(r["lat"])]
            },
            "properties": {
                "intensity": round(intensity, 3),
                "rainfall_48h": r.get("rainfall_48h", 0.0),
                "soil_moisture": r.get("soil_moisture", 0.0),
                "slope": r.get("slope", 0.0),
                "elevation": r.get("elevation", 0.0),
                "land_use": r.get("land_use", "Degraded Forest"),
                "historical_event": int(r.get("historical_landslide", 0)),
                "state": r.get("state", "NER")
            }
        })

    return {
        "type": "FeatureCollection",
        "total_points": len(features),
        "features": features
    }
