"""
Realistic Government & Satellite API Mock Server (Phase 4)
Simulates exact payload responses for:
1. IMD Automatic Weather Station (AWS) API
2. Copernicus Sentinel-1 InSAR Displacement API
3. NASA SMAP Volumetric Soil Moisture API
4. CDAC Sachet Common Alerting Protocol (CAP) API

Every endpoint includes '# TODO: connect real API here' instructions for seamless live replacement.
"""
from fastapi import FastAPI, Query
from typing import Optional, Dict, Any, List
import datetime
import random

app = FastAPI(
    title="NER Disaster Data Gateway & Government Mock Server",
    description="Simulates official government API responses (IMD, Copernicus GEE, NASA SMAP, CDAC Sachet) for offline testing and SIH hackathon evaluation.",
    version="1.0.0"
)


# ==============================================================================
# 1. IMD AUTOMATIC WEATHER STATION (AWS) API
# ==============================================================================
@app.get("/imd/aws/current", summary="IMD AWS Precipitation & Weather Telemetry")
def get_imd_aws(station_id: Optional[str] = Query(None, description="IMD Station Code, e.g. IMD_KA_01")):
    """
    Simulates IMD Pune / Mausam API response format.
    # TODO: connect real API here
    # Real Endpoint: https://mausam.imd.gov.in/api/v1/aws/current
    # Real Header: Authorization: Bearer <IMD_API_KEY from data.gov.in>
    # Python Code to replace:
    #   response = requests.get("https://mausam.imd.gov.in/api/v1/aws/current", headers={"Authorization": f"Bearer {os.getenv('IMD_API_KEY')}"})
    #   return response.json()
    """
    now = datetime.datetime.utcnow().isoformat() + "Z"
    
    # Karbi Anglong / Diphu Focus
    return {
        "status": "SUCCESS",
        "agency": "India Meteorological Department (IMD)",
        "query_timestamp": now,
        "stations": [
            {
                "station_id": station_id or "IMD_KA_DIPHU_01",
                "station_name": "Diphu Hill Observatory",
                "district": "Karbi Anglong",
                "state": "Assam",
                "latitude": 25.84,
                "longitude": 93.43,
                "elevation_m": 186.0,
                "hourly_rainfall_mm": 54.5,
                "cumulative_24h_rainfall_mm": 178.2,
                "cumulative_48h_rainfall_mm": 265.0,
                "temperature_c": 24.2,
                "relative_humidity_pct": 96.0,
                "wind_speed_kmh": 22.4,
                "cloudburst_warning": True,
                "quality_check": "QC_PASSED"
            },
            {
                "station_id": "IMD_KA_BOKAJAN_02",
                "station_name": "Bokajan AWS",
                "district": "Karbi Anglong",
                "state": "Assam",
                "latitude": 26.01,
                "longitude": 93.78,
                "elevation_m": 138.0,
                "hourly_rainfall_mm": 32.0,
                "cumulative_24h_rainfall_mm": 115.0,
                "cumulative_48h_rainfall_mm": 180.4,
                "temperature_c": 25.8,
                "relative_humidity_pct": 91.0,
                "wind_speed_kmh": 14.5,
                "cloudburst_warning": False,
                "quality_check": "QC_PASSED"
            }
        ]
    }


# ==============================================================================
# 2. COPERNICUS SENTINEL-1 InSAR GROUND DISPLACEMENT API
# ==============================================================================
@app.get("/copernicus/sentinel1/insar", summary="Sentinel-1 InSAR Surface Creep Telemetry")
def get_sentinel1_insar(bbox: Optional[str] = "93.2,25.6,93.8,26.2"):
    """
    Simulates Copernicus Data Space Ecosystem InSAR displacement.
    # TODO: connect real API here
    # Real Endpoint: https://dataspace.copernicus.eu/odata/v1/Products
    # Real Auth: OAuth2 Token from Copernicus Data Space Credentials
    # Python Code to replace:
    #   ee.Initialize(credentials)
    #   s1 = ee.ImageCollection('COPERNICUS/S1_GRD').filterBounds(ee.Geometry.BBox(...))
    #   displacement = run_insar_phase_unwrapping(s1)
    """
    now = datetime.datetime.utcnow().isoformat() + "Z"
    return {
        "status": "SUCCESS",
        "mission": "Sentinel-1C C-Band Synthetic Aperture Radar (SAR)",
        "product_type": "Interferometric Wide (IW) Single Look Complex (SLC)",
        "temporal_baseline_days": 12,
        "region": "Karbi Anglong Hill Slopes, Assam",
        "bbox": [float(x) for x in bbox.split(",")],
        "mean_deformation_velocity_mm_yr": -22.4, # Negative signifies downslope subsidence
        "max_subsidence_point": {
            "latitude": 25.852,
            "longitude": 93.441,
            "velocity_mm_yr": -34.8,
            "interpretation": "Active progressive slope creep along Lumding-Diphu highway cutting"
        },
        "coherence": 0.88,
        "timestamp": now
    }


# ==============================================================================
# 3. NASA SMAP VOLUMETRIC SOIL MOISTURE API
# ==============================================================================
@app.get("/nasa/smap/soil-moisture", summary="NASA SMAP Volumetric Soil Moisture")
def get_nasa_smap(lat: float = 25.84, lon: float = 93.43):
    """
    Simulates NASA SMAP L4 Global 9km Hydro-Observation product.
    # TODO: connect real API here
    # Real Endpoint: https://nsidc.org/api/smap/v4/point
    # Real Auth: NASA Earthdata Login URS Bearer Token
    # Python Code to replace:
    #   response = requests.get(f"https://nsidc.org/api/smap/v4?lat={lat}&lon={lon}", headers={"Authorization": f"Bearer {os.getenv('EARTHDATA_TOKEN')}"})
    #   return response.json()
    """
    return {
        "status": "SUCCESS",
        "source": "NASA SMAP L4 Enhanced Surface & Root-Zone Soil Moisture",
        "latitude": lat,
        "longitude": lon,
        "surface_soil_moisture_m3_m3": 0.442,
        "root_zone_soil_moisture_m3_m3": 0.468,
        "soil_saturation_pct": 93.5, # 93.5% saturated
        "pore_water_pressure_status": "CRITICAL_OVERSATURATION",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }


# ==============================================================================
# 4. CDAC SACHET COMMON ALERTING PROTOCOL (CAP) API
# ==============================================================================
@app.get("/cdac/sachet/cap", summary="NDMA / CDAC Sachet Disaster Feed")
def get_cdac_sachet_cap():
    """
    Simulates NDMA Common Alerting Protocol (CAP-CP) XML/JSON feed.
    # TODO: connect real API here
    # Real Endpoint: https://sachet.ndma.gov.in/cap_feed/api/v1/ner
    # Real Auth: CDAC API Key
    """
    return {
        "identifier": "NDMA-CAP-NER-2026-0905-001",
        "sender": "State Disaster Management Authority (ASDMA Assam)",
        "sent": datetime.datetime.utcnow().isoformat() + "Z",
        "status": "Actual",
        "msgType": "Alert",
        "scope": "Public",
        "info": {
            "category": "Geo",
            "event": "Landslide & Slope Failure Red Alert",
            "urgency": "Immediate",
            "severity": "Extreme",
            "certainty": "Observed",
            "areaDesc": "Karbi Anglong District (Diphu Sub-division), Assam",
            "headline": "RED ALERT: High Probability of Landslides along Diphu-Lumding Road",
            "instruction": "Villagers residing in low-lying terrace slopes advised to evacuate to nearest designated safe relief shelters immediately."
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
