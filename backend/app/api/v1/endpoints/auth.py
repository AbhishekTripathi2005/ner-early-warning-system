from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import datetime

router = APIRouter()

MOCK_OFFICER = {
    "username": "sih_officer_ner",
    "password": "sih2026_password",
    "full_name": "Major Arvind Sharma",
    "badge_id": "NDRF-NER-884",
    "agency": "SDRF Meghalaya & MDoNER Emergency Response",
    "state": "Meghalaya",
    "role": "FIELD_DISASTER_COMMANDER"
}


class LoginRequest(BaseModel):
    username: str
    password: str


class OfficerResponse(BaseModel):
    token: str
    officer: dict


@router.post("/login", response_model=OfficerResponse, summary="Officer Authentication Login")
async def officer_login(payload: LoginRequest):
    """
    Authenticates Disaster Management Officer and issues JWT session token.
    Default credentials for Hackathon demo: sih_officer_ner / sih2026_password
    """
    if payload.username == MOCK_OFFICER["username"] and payload.password == MOCK_OFFICER["password"]:
        return {
            "token": "eyJhGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sih_ner_disaster_officer_token_valid_2026",
            "officer": {
                "username": MOCK_OFFICER["username"],
                "full_name": MOCK_OFFICER["full_name"],
                "badge_id": MOCK_OFFICER["badge_id"],
                "agency": MOCK_OFFICER["agency"],
                "state": MOCK_OFFICER["state"],
                "role": MOCK_OFFICER["role"]
            }
        }
    raise HTTPException(status_code=401, detail="Invalid officer credentials")


@router.get("/me", summary="Current Officer Session Profile")
async def get_current_officer():
    """Returns profile of currently logged-in emergency commander."""
    return {
        "status": "authenticated",
        "officer": MOCK_OFFICER
    }
