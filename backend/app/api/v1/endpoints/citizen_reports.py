from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()

MOCK_CITIZEN_REPORTS = [
    {
        "id": 501,
        "reporter_name": "Tashi Bhutia",
        "reporter_phone": "+91-98765-43210",
        "latitude": 27.24,
        "longitude": 88.51,
        "state": "Sikkim",
        "district": "East Sikkim",
        "hazard_type": "New Hill Fissure / Creep",
        "severity_reported": "SEVERE",
        "description": "Noticed 5-inch wide lateral crack opening across terrace slope behind community school after continuous downpour.",
        "photo_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
        "status": "PENDING_REVIEW",
        "reviewed_by_officer": None,
        "created_at": "2026-09-05T14:30:00Z"
    },
    {
        "id": 502,
        "reporter_name": "Donboklang Lyngdoh",
        "reporter_phone": "+91-94361-11223",
        "latitude": 25.29,
        "longitude": 91.70,
        "state": "Meghalaya",
        "district": "East Khasi Hills",
        "hazard_type": "Retaining Wall Bulging",
        "severity_reported": "HIGH",
        "description": "Concrete road culvert retaining wall tilting outward with turbid brown seepage water emerging from weep holes.",
        "photo_url": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
        "status": "VERIFIED_TRUE_ALARM",
        "reviewed_by_officer": "Major Arvind Sharma (Badge #NDRF-NER-884)",
        "created_at": "2026-09-05T11:15:00Z"
    }
]


class ReportSubmitRequest(BaseModel):
    reporter_name: Optional[str] = "Citizen"
    reporter_phone: Optional[str] = None
    latitude: float
    longitude: float
    state: Optional[str] = "NER"
    district: Optional[str] = "Hill Sector"
    hazard_type: str = "Slope Creep / Crack"
    severity_reported: str = "HIGH"
    description: str
    photo_url: Optional[str] = None


class ReportReviewRequest(BaseModel):
    action: str = Field(..., example="VERIFY_TRUE_ALARM", description="VERIFY_TRUE_ALARM | DISMISS_FALSE_ALARM")
    officer_name: str = Field(..., example="Major Arvind Sharma")
    officer_notes: Optional[str] = "Ground team deployed; road section cordon initiated."


@router.get("", summary="Get Citizen Incident Reports (Officer Review Queue)")
async def list_citizen_reports(status: Optional[str] = None):
    """List all crowdsourced reports for field officer verification."""
    reports = MOCK_CITIZEN_REPORTS
    if status:
        reports = [r for r in reports if r["status"] == status]
    return {
        "count": len(reports),
        "reports": reports
    }


@router.post("/submit", summary="Submit Citizen Landslide Report (Sync Entrypoint)")
async def submit_citizen_report(payload: ReportSubmitRequest):
    """
    Submits crowdsourced observation. Works offline on Flutter app
    and auto-syncs when cellular connection resumes.
    """
    new_report = {
        "id": len(MOCK_CITIZEN_REPORTS) + 501,
        "reporter_name": payload.reporter_name,
        "reporter_phone": payload.reporter_phone,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "state": payload.state,
        "district": payload.district,
        "hazard_type": payload.hazard_type,
        "severity_reported": payload.severity_reported,
        "description": payload.description,
        "photo_url": payload.photo_url or "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
        "status": "PENDING_REVIEW",
        "reviewed_by_officer": None,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    MOCK_CITIZEN_REPORTS.insert(0, new_report)
    return {
        "status": "success",
        "message": "Citizen incident report recorded and queued for officer dispatch",
        "report_id": new_report["id"]
    }


@router.patch("/{report_id}/review", summary="Officer Action: Verify or Dismiss Report")
async def review_citizen_report(report_id: int, payload: ReportReviewRequest):
    """Officer marks report as Verified True Alarm or Dismissed False Alarm."""
    for r in MOCK_CITIZEN_REPORTS:
        if r["id"] == report_id:
            new_status = "VERIFIED_TRUE_ALARM" if "VERIFY" in payload.action.upper() else "DISMISSED_FALSE_ALARM"
            r["status"] = new_status
            r["reviewed_by_officer"] = payload.officer_name
            r["officer_notes"] = payload.officer_notes
            return {
                "status": "updated",
                "report_id": report_id,
                "new_status": new_status,
                "reviewed_by": payload.officer_name
            }
    raise HTTPException(status_code=404, detail="Citizen report ID not found")
