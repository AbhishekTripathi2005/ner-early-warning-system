"""
Database Seeder Script (Phase 1 & Phase 3)
Reads synthetic_landslide_ner_dataset.csv and inserts georeferenced records
into PostGIS table landslide_risk_points.
"""
import os
import sys
import pandas as pd

# Path configuration
base_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(base_dir, "..", "..", "ml-engine", "data", "synthetic_landslide_ner_dataset.csv")


def seed_postgis_data():
    if not os.path.exists(csv_path):
        print(f"Error: Dataset not found at {csv_path}. Run ml-engine/data/generate_dataset.py first.")
        return False

    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} records from {csv_path}")

    # Generate SQL batch insert statement
    sql_file = os.path.join(base_dir, "seed_risk_points.sql")
    with open(sql_file, "w") as f:
        f.write("-- Automated PostGIS Seed Script for NER Landslide Risk Points\n")
        f.write("BEGIN;\n")
        for _, row in df.iterrows():
            f.write(
                f"INSERT INTO landslide_risk_points (latitude, longitude, rainfall_24h, rainfall_48h, soil_moisture, slope, elevation, land_use, distance_to_road, historical_landslide, state, geom) "
                f"VALUES ({row['lat']}, {row['lon']}, {row['rainfall_24h']}, {row['rainfall_48h']}, {row['soil_moisture']}, {row['slope']}, {row['elevation']}, '{row['land_use']}', {row['distance_to_road']}, {row['historical_landslide']}, '{row['state']}', ST_SetSRID(ST_MakePoint({row['lon']}, {row['lat']}), 4326)) "
                f"ON CONFLICT DO NOTHING;\n"
            )
        f.write("COMMIT;\n")

    print(f"Generated SQL seed file with {len(df)} spatial points at: {sql_file}")
    return True


if __name__ == "__main__":
    seed_postgis_data()
