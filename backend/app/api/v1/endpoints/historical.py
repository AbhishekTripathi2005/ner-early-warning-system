from fastapi import APIRouter

router = APIRouter()

MOCK_HISTORICAL_TRENDS = {
    "decadal_overview": {
        "period": "2015-2025",
        "source": "Geological Survey of India (GSI) & MDoNER Disaster Cell",
        "total_recorded_events": 1420,
        "critical_monsoon_months": ["June", "July", "August", "September"]
    },
    "yearly_events": [
        {"year": 2018, "events": 88, "severe_events": 12, "avg_monsoon_rain_mm": 2100},
        {"year": 2019, "events": 104, "severe_events": 18, "avg_monsoon_rain_mm": 2350},
        {"year": 2020, "events": 132, "severe_events": 24, "avg_monsoon_rain_mm": 2580},
        {"year": 2021, "events": 121, "severe_events": 20, "avg_monsoon_rain_mm": 2410},
        {"year": 2022, "events": 198, "severe_events": 42, "avg_monsoon_rain_mm": 3100},
        {"year": 2023, "events": 174, "severe_events": 34, "avg_monsoon_rain_mm": 2850},
        {"year": 2024, "events": 210, "severe_events": 46, "avg_monsoon_rain_mm": 3220},
        {"year": 2025, "events": 185, "severe_events": 38, "avg_monsoon_rain_mm": 2980}
    ],
    "state_breakdown": [
        {"state": "Meghalaya", "percentage": 28.5, "primary_trigger": "Excessive Cloudburst & Sandstone Shearing"},
        {"state": "Sikkim", "percentage": 24.2, "primary_trigger": "Steep Himalayan Relief & InSAR Creep"},
        {"state": "Assam (Dima Hasao)", "percentage": 18.1, "primary_trigger": "Railway/Highway Cut Slopes & Siltation"},
        {"state": "Mizoram", "percentage": 11.4, "primary_trigger": "Parallel Anticline Folds"},
        {"state": "Nagaland", "percentage": 9.6, "primary_trigger": "Active Thrust Faults"},
        {"state": "Arunachal Pradesh", "percentage": 8.2, "primary_trigger": "High Altitude Debris Slides"}
    ]
}


@router.get("", summary="Get Decadal Historical Landslide Trends")
async def get_historical_trends():
    """Returns 10-year historical landslide incidence trends and state breakdowns for NER."""
    return MOCK_HISTORICAL_TRENDS
