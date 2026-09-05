import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Based Early Warning & Landslide Risk Monitoring System for North Eastern Region (SIH 2026 - SIH26001, MDoNER)",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Enable CORS for Next.js frontend & Flutter mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


# WebSocket Connection Manager for Real-Time Dashboard Feeds
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_json(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass


ws_manager = ConnectionManager()


@app.websocket("/ws/live-dashboard")
async def websocket_live_dashboard(websocket: WebSocket):
    """
    WebSocket channel for live dashboard streaming:
    Pushes rainfall bursts, sensor pings, and emergency siren broadcasts in real time.
    """
    await ws_manager.connect(websocket)
    try:
        # Initial greeting packet
        await websocket.send_text(json.dumps({
            "type": "STREAM_ESTABLISHED",
            "message": "Connected to NER Early Warning Real-Time Dispatch Stream",
            "monitored_region": "North Eastern Region (8 States)"
        }))
        while True:
            # Heartbeat listener / bidirectional command handler
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text(json.dumps({"type": "PONG"}))
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "AI-Based Landslide Early Warning System API (NER - MDoNER SIH26001)",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "websocket_stream": "/ws/live-dashboard",
        "status": "online"
    }
