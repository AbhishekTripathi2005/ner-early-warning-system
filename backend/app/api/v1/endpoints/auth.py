"""
Officer Authentication Endpoint
Implements bcrypt-hashed credential verification and PyJWT RFC 7519 signed token issuance.
"""
import os
import datetime
import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET_KEY", "sih2026_mdoner_disaster_ops_jwt_secret_key_884")
JWT_ALGORITHM = "HS256"

# Bcrypt hash generated with 12 salt rounds for "sih2026_password"
OFFICER_DB = {
    "sih_officer_ner": {
        "username": "sih_officer_ner",
        "password_hash": "$2b$12$mlrc6NhZc1BtNSh.SQK0JuqtKriKvjkRNZOIWIQ5TnNpvAHn0p4Fm",
        "full_name": "Major Arvind Sharma",
        "badge_id": "NDRF-NER-884",
        "agency": "SDRF Meghalaya & MDoNER Emergency Incident Command",
        "state": "Meghalaya",
        "role": "FIELD_DISASTER_COMMANDER"
    }
}


class LoginRequest(BaseModel):
    username: str
    password: str


class OfficerResponse(BaseModel):
    token: str
    token_type: str = "Bearer"
    expires_in_hours: int = 24
    officer: dict


def verify_jwt_token(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency to validate PyJWT token on protected administrative actions."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Bearer authorization header")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Cryptographically invalid security token.")


@router.post("/login", response_model=OfficerResponse, summary="Officer Authentication Login")
async def officer_login(payload: LoginRequest):
    """
    Authenticates Disaster Management Officer via bcrypt password verification
    and issues an RFC 7519 compliant PyJWT access token.
    Default credentials for Hackathon demo: sih_officer_ner / sih2026_password
    """
    user = OFFICER_DB.get(payload.username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid officer ID or unauthorized badge code")

    # Bcrypt cryptographic comparison
    is_valid = bcrypt.checkpw(
        payload.password.encode("utf-8"),
        user["password_hash"].encode("utf-8")
    )
    if not is_valid:
        raise HTTPException(status_code=401, detail="Authentication failed: incorrect security PIN")

    now = datetime.datetime.now(datetime.timezone.utc)
    token_payload = {
        "sub": user["username"],
        "full_name": user["full_name"],
        "badge_id": user["badge_id"],
        "agency": user["agency"],
        "role": user["role"],
        "iat": int(now.timestamp()),
        "exp": int((now + datetime.timedelta(hours=24)).timestamp())
    }

    signed_token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return {
        "token": signed_token,
        "token_type": "Bearer",
        "expires_in_hours": 24,
        "officer": {
            "username": user["username"],
            "full_name": user["full_name"],
            "badge_id": user["badge_id"],
            "agency": user["agency"],
            "state": user["state"],
            "role": user["role"]
        }
    }


@router.get("/me", summary="Current Officer Session Profile")
async def get_current_officer(auth_payload: dict = Depends(verify_jwt_token)):
    """Returns verified profile from validated PyJWT claims."""
    return {
        "status": "authenticated",
        "officer": auth_payload
    }
