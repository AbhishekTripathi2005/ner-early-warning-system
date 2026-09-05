"""
Synthetic Landslide Dataset Generator for North Eastern Region (NER)
Produces 800 georeferenced records with physical geotechnical correlations
between terrain steepness, antecedent rainfall, soil moisture, and landslide occurrence.
"""
import os
import random
import numpy as np
import pandas as pd

# Regional NER Clusters with typical geomorphology
NER_CLUSTERS = [
    # Meghalaya (High rainfall, moderate-to-steep sandstone-shale plateau)
    {"state": "Meghalaya", "center_lat": 25.45, "center_lon": 91.80, "base_slope": 36.0, "base_rain": 140.0, "elev_range": (800, 1950)},
    # Sikkim (High Himalayan terrain, extreme slope, seismic foliation)
    {"state": "Sikkim", "center_lat": 27.35, "center_lon": 88.60, "base_slope": 42.0, "base_rain": 110.0, "elev_range": (1100, 3800)},
    # Assam - Dima Hasao / Karbi Anglong (Steep hill cuttings, clayey shales)
    {"state": "Assam", "center_lat": 25.20, "center_lon": 93.05, "base_slope": 28.0, "base_rain": 95.0, "elev_range": (300, 1200)},
    # Mizoram (Parallel fold ridges, fragile siltstone)
    {"state": "Mizoram", "center_lat": 23.45, "center_lon": 93.10, "base_slope": 31.0, "base_rain": 85.0, "elev_range": (600, 1800)},
    # Nagaland (Steep escarpments, active thrust belts)
    {"state": "Nagaland", "center_lat": 25.75, "center_lon": 94.20, "base_slope": 34.0, "base_rain": 90.0, "elev_range": (700, 2400)},
    # Arunachal Pradesh (High relief, high seismic activity, intense monsoon)
    {"state": "Arunachal Pradesh", "center_lat": 27.20, "center_lon": 93.50, "base_slope": 39.0, "base_rain": 125.0, "elev_range": (900, 3200)},
    # Manipur (Hill slopes around Imphal valley)
    {"state": "Manipur", "center_lat": 24.85, "center_lon": 93.90, "base_slope": 27.0, "base_rain": 80.0, "elev_range": (500, 1600)},
    # Tripura (Low-lying anticlines, high river bank erosion)
    {"state": "Tripura", "center_lat": 23.85, "center_lon": 91.80, "base_slope": 18.0, "base_rain": 70.0, "elev_range": (150, 750)}
]

LAND_USE_TYPES = [
    "Dense Forest",
    "Degraded Forest",
    "Agricultural Terrace",
    "Barren Land / Quarry",
    "Settlement / Road Corridor"
]


def generate_synthetic_dataset(n_samples: int = 800, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    random.seed(random_seed)

    rows = []
    samples_per_cluster = n_samples // len(NER_CLUSTERS)

    for cluster in NER_CLUSTERS:
        for _ in range(samples_per_cluster):
            # Coordinates with jitter
            lat = round(float(np.random.normal(cluster["center_lat"], 0.22)), 4)
            lon = round(float(np.random.normal(cluster["center_lon"], 0.22)), 4)

            # Topographic features
            slope = float(np.clip(np.random.normal(cluster["base_slope"], 8.5), 5.0, 68.0))
            elevation = float(np.clip(np.random.uniform(cluster["elev_range"][0], cluster["elev_range"][1]), 100.0, 4500.0))
            
            # Rainfall dynamics (24h and 48h)
            rain_24h = float(np.clip(np.random.exponential(cluster["base_rain"] * 0.7), 5.0, 350.0))
            rain_48h = float(rain_24h + np.clip(np.random.exponential(cluster["base_rain"] * 0.85), 10.0, 380.0))

            # Soil moisture (% saturation) correlated with rainfall
            moisture_base = 35.0 + (rain_48h / 450.0) * 55.0 + np.random.normal(0, 5.0)
            soil_moisture = float(np.clip(moisture_base, 15.0, 99.0))

            # Distance to road cut (meters) - road construction cuts destabilize toes
            distance_to_road = float(np.clip(np.random.exponential(450.0), 10.0, 3500.0))

            # Land use
            land_use = random.choices(
                LAND_USE_TYPES,
                weights=[0.35, 0.25, 0.15, 0.12, 0.13],
                k=1
            )[0]

            # Geotechnical Hazard Probability Formula (Physics-Informed logistic function)
            # Factors:
            # 1. Slope: Steep slopes (>32 deg) drastically increase shear stress
            # 2. Rain: 48h antecedent rainfall increases pore water pressure
            # 3. Soil moisture: High saturation reduces effective soil cohesion
            # 4. Road proximity: Toe excavation creates destabilizing cut slopes
            # 5. Land use: Vegetated roots stabilize; barren/degraded destabilizes
            land_use_penalty = {
                "Dense Forest": -0.8,
                "Degraded Forest": 0.3,
                "Agricultural Terrace": 0.1,
                "Barren Land / Quarry": 1.1,
                "Settlement / Road Corridor": 0.9
            }[land_use]

            road_proximity_factor = max(0.0, 1.0 - (distance_to_road / 600.0)) # High if <600m
            
            z = (
                -4.5 +
                (slope / 18.0) +
                (rain_48h / 140.0) +
                (soil_moisture / 45.0) +
                (road_proximity_factor * 1.3) +
                land_use_penalty
            )
            prob_landslide = 1.0 / (1.0 + np.exp(-z))
            historical_landslide = 1 if (random.random() < prob_landslide) else 0

            rows.append({
                "lat": lat,
                "lon": lon,
                "rainfall_24h": round(rain_24h, 1),
                "rainfall_48h": round(rain_48h, 1),
                "soil_moisture": round(soil_moisture, 1),
                "slope": round(slope, 1),
                "elevation": round(elevation, 1),
                "land_use": land_use,
                "distance_to_road": round(distance_to_road, 1),
                "historical_landslide": historical_landslide,
                "state": cluster["state"]
            })

    df = pd.DataFrame(rows)
    return df


if __name__ == "__main__":
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_csv = os.path.join(output_dir, "synthetic_landslide_ner_dataset.csv")
    df = generate_synthetic_dataset(n_samples=800)
    df.to_csv(output_csv, index=False)
    print(f"Successfully generated {len(df)} records in {output_csv}")
    print(f"Landslide event distribution:\n{df['historical_landslide'].value_counts(normalize=True)}")
