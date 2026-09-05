# 🌐 Backend Service: FastAPI + PostGIS + Redis + Celery

## 📌 Kya Banaya Gaya Hai (Overview)
Yeh service platform ka central nervous system hai:
1. **FastAPI Asynchronous Web Engine**: High-throughput REST APIs for GIS dashboards, mobile sync, and alerts.
2. **PostGIS Spatial Database Support**: GeoAlchemy2 models to store spatial geometries (Polygons, Points) for landslide zones, IoT rain gauges, and evacuation paths.
3. **Celery Worker & Redis Broker**: Asynchronous background jobs that monitor real-time rainfall triggers against AI risk thresholds and trigger SMS/Push notifications.
4. **Mock Fallback Engine**: Har endpoint mock/dummy data provide karta hai jab database connection ya external sensors offline hon, ensuring SIH demo zero-breakage guarantee.

---

## 🚀 Kaise Chalayein (Local & Docker)

### Option A: Via Docker Compose (Recommended)
```bash
# Infra directory se run karein
cd ../infra
docker compose up backend celery-worker -d
```

### Option B: Local Python Development
```bash
cd backend

# Virtual environment create karein
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Dependencies install karein
pip install -r requirements.txt

# Environment file copy karein
cp .env.example .env

# FastAPI Server start karein
uvicorn app.main:app --reload --port 8000

# Celery Worker (alag terminal mein)
celery -A app.tasks.celery_worker.celery_app worker --loglevel=info
```

API Documentation & Swagger UI: `http://localhost:8000/docs`

---

## 📡 Endpoints Summary
- `GET /api/v1/health` - Check API and DB status.
- `GET /api/v1/risk-zones` - High-risk zones GeoJSON for NER (Sikkim, Shillong, Guwahati, Champhai, etc.).
- `GET /api/v1/alerts` - Active alerts sorted by severity (LOW, MODERATE, HIGH, SEVERE).
- `POST /api/v1/alerts/broadcast` - Trigger emergency multi-channel broadcast.
- `GET /api/v1/sensors` - Real-time IoT rainfall and soil moisture telemetry.

---

## 🛰️ Real Data Source Integration Plan (Baad Mein Connect Karne Ke Liye)

| Source | Real API / Protocol | Future Integration Method |
| :--- | :--- | :--- |
| **IMD AWS / Gridded Rainfall** | IMD Pune API / Mausam portal (JSON/NetCDF) | Ingest via scheduled Celery beat task into `sensors` table. |
| **PostGIS Spatial Layers** | Bhuvan (ISRO) Landslide Susceptibility WMS/WFS | Direct SQL import using `shp2pgsql` or GeoPandas. |
| **SMS Gateway** | Twilio SMS API / CDAC Emergency Broadcast Service | Set `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` in `.env`. |
| **App Notifications** | Firebase Cloud Messaging (FCM v1 HTTP API) | Place `service-account.json` and set `FCM_CREDENTIALS_PATH`. |
