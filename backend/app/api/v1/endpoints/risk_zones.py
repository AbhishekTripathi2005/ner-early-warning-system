from fastapi import APIRouter
from app.schemas.risk_zone import GeoJSONFeatureCollection

router = APIRouter()

# Realistic High-Risk Landslide Hazard zones across North Eastern Region (NER)
MOCK_NER_ZONES = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [91.85, 25.55],
                        [91.95, 25.55],
                        [91.95, 25.65],
                        [91.85, 25.65],
                        [91.85, 25.55]
                    ]
                ]
            },
            "properties": {
                "zone_code": "NER-ML-01",
                "name": "East Khasi Hills (Cherrapunji-Shillong Belt)",
                "state": "Meghalaya",
                "district": "East Khasi Hills",
                "risk_level": "SEVERE",
                "susceptibility_score": 0.89,
                "slope_degrees": 44.5,
                "antecedent_rainfall_72h": 260.4,
                "soil_saturation_pct": 92.0
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [88.55, 27.25],
                        [88.65, 27.25],
                        [88.65, 27.35],
                        [88.55, 27.35],
                        [88.55, 27.25]
                    ]
                ]
            },
            "properties": {
                "zone_code": "NER-SK-02",
                "name": "Gangtok-Singtam Corridor",
                "state": "Sikkim",
                "district": "East Sikkim",
                "risk_level": "HIGH",
                "susceptibility_score": 0.78,
                "slope_degrees": 38.2,
                "antecedent_rainfall_72h": 145.0,
                "soil_saturation_pct": 84.5
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [93.10, 25.10],
                        [93.22, 25.10],
                        [93.22, 25.20],
                        [93.10, 25.20],
                        [93.10, 25.10]
                    ]
                ]
            },
            "properties": {
                "zone_code": "NER-AS-03",
                "name": "Dima Hasao Hill Slopes (Haflong)",
                "state": "Assam",
                "district": "Dima Hasao",
                "risk_level": "MODERATE",
                "susceptibility_score": 0.62,
                "slope_degrees": 29.0,
                "antecedent_rainfall_72h": 98.2,
                "soil_saturation_pct": 71.0
            }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [93.20, 23.35],
                        [93.35, 23.35],
                        [93.35, 23.45],
                        [93.20, 23.45],
                        [93.20, 23.35]
                    ]
                ]
            },
            "properties": {
                "zone_code": "NER-MZ-04",
                "name": "Champhai Hill Sector",
                "state": "Mizoram",
                "district": "Champhai",
                "risk_level": "LOW",
                "susceptibility_score": 0.28,
                "slope_degrees": 18.5,
                "antecedent_rainfall_72h": 22.0,
                "soil_saturation_pct": 39.5
            }
        }
    ]
}


@router.get("", response_model=GeoJSONFeatureCollection, summary="List Landslide Risk Zones (GeoJSON)")
async def get_risk_zones():
    """Returns spatial polygons with real-time risk scores for NER."""
    return MOCK_NER_ZONES
