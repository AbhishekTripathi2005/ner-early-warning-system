"""
Synthetic geospatial and meteorological dataset generator for the North Eastern Region (NER).
Simulates realistic conditions across Meghalaya, Sikkim, Assam, and Mizoram.
"""
import random
from typing import List, Dict, Any


NER_SAMPLE_HOTSPOTS = [
    {"name": "Cherrapunji Hills", "state": "Meghalaya", "lat": 25.27, "lon": 91.73, "base_slope": 42.0},
    {"name": "Gangtok Ridge", "state": "Sikkim", "lat": 27.33, "lon": 88.61, "base_slope": 38.5},
    {"name": "Haflong Cutting Zone", "state": "Assam", "lat": 25.18, "lon": 93.02, "base_slope": 31.0},
    {"name": "Champhai Sector", "state": "Mizoram", "lat": 23.47, "lon": 93.32, "base_slope": 26.0},
    {"name": "Kohima Escarpment", "state": "Nagaland", "lat": 25.67, "lon": 94.10, "base_slope": 35.0}
]


def generate_synthetic_ner_batch(count: int = 10) -> List[Dict[str, Any]]:
    """Generates synthetic sensor & environmental reading records."""
    samples = []
    for i in range(count):
        hotspot = random.choice(NER_SAMPLE_HOTSPOTS)
        slope = max(5.0, min(65.0, hotspot["base_slope"] + random.uniform(-6.0, 8.0)))
        rainfall_72h = random.uniform(10.0, 320.0) # mm
        soil_moisture = min(100.0, max(20.0, (rainfall_72h * 0.25) + random.uniform(15.0, 35.0)))
        insar_creep_mm_yr = random.uniform(-25.0, 5.0)
        
        samples.append({
            "sample_id": f"NER-SIM-{1000 + i}",
            "location_name": hotspot["name"],
            "state": hotspot["state"],
            "latitude": round(hotspot["lat"] + random.uniform(-0.05, 0.05), 4),
            "longitude": round(hotspot["lon"] + random.uniform(-0.05, 0.05), 4),
            "slope_degrees": round(slope, 1),
            "antecedent_rainfall_72h": round(rainfall_72h, 1),
            "soil_moisture_pct": round(soil_moisture, 1),
            "insar_displacement_rate_mm_yr": round(insar_creep_mm_yr, 2),
            "lithology_type": random.choice(["Sandstone-Shale", "Schist-Gneiss", "Alluvium", "Limestone"])
        })
    return samples
