from fastapi import APIRouter

router = APIRouter()

MOCK_ROAD_STATUSES = [
    {
        "segment_id": "ROAD-SK-01",
        "highway": "NH-10 (Sikkim Lifeline)",
        "corridor": "Sevoke Junction to Teesta Bazaar",
        "state": "Sikkim / WB Border",
        "status": "BLOCKED",
        "risk_score": 0.88,
        "hazard_type": "Active Debris Avalanche at 29th Mile",
        "clearance_eta_hours": 6,
        "detour_advised": "Divert light vehicles via Panbu - Mungpoo - Jorethang link road. Heavy vehicles halted at Sevoke."
    },
    {
        "segment_id": "ROAD-SK-02",
        "highway": "NH-10 (Upper Corridor)",
        "corridor": "Singtam to Gangtok Capital",
        "state": "Sikkim",
        "status": "HIGH_RISK_ONE_WAY",
        "risk_score": 0.76,
        "hazard_type": "Slope Subsidence & Minor Rockfall",
        "clearance_eta_hours": 2,
        "detour_advised": "One-way convoy escort enforced by Traffic Police."
    },
    {
        "segment_id": "ROAD-ML-03",
        "highway": "SH-5 (Shillong-Cherrapunji)",
        "corridor": "Mawkdok Dympep Bridge Sector",
        "state": "Meghalaya",
        "status": "OPERATIONAL_CAUTION",
        "risk_score": 0.58,
        "hazard_type": "Dense Fog & Water Logging",
        "clearance_eta_hours": 0,
        "detour_advised": "Maintain speed limit below 30 km/h due to reduced braking grip."
    },
    {
        "segment_id": "ROAD-AS-04",
        "highway": "NH-6 (Assam-Meghalaya Arterial)",
        "corridor": "Nongpoh to Umiam Lake",
        "state": "Meghalaya / Assam",
        "status": "OPERATIONAL",
        "risk_score": 0.22,
        "hazard_type": "Clear",
        "clearance_eta_hours": 0,
        "detour_advised": "Normal vehicular movement permitted."
    }
]


@router.get("", summary="Get Real-Time Highway & Road Status")
async def get_road_status():
    """Returns active connectivity status, blockages, and detours for major NER arterial lifelines."""
    return {
        "count": len(MOCK_ROAD_STATUSES),
        "corridors": MOCK_ROAD_STATUSES
    }
