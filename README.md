# 🏔️ AI-Based Early Warning & Landslide Risk Monitoring System in NER
> **Smart India Hackathon 2026 | Problem ID: SIH26001**  
> **Ministry**: Ministry of Development of North Eastern Region (MDoNER)  
> **Theme**: Disaster Management | **Category**: Software  
> **Target Region**: North Eastern Region (NER) of India (Assam, Meghalaya, Sikkim, Arunachal Pradesh, Mizoram, Nagaland, Manipur, Tripura)

---

## 📌 Executive Summary

The North Eastern Region (NER) of India suffers devastating landslides every monsoon season due to steep topography, fragile Himalayan and Indo-Burman geology, high seismic activity, and extreme cloudburst/monsoon rainfall. 

This platform delivers an end-to-end, cloud-native early warning system combining:
1. **Multi-Source Geospatial Ingestion**: Satellite SAR (Sentinel-1), Optical (Sentinel-2), SRTM/Copernicus Digital Elevation Models (DEM), and IMD Gridded Rainfall.
2. **Predictive AI/ML Engine**: Real-time Landslide Susceptibility Index (LSI) & Dynamic Threshold Triggering using XGBoost, PyTorch, and GeoAI.
3. **Interactive GIS Web Dashboard**: Next.js + MapLibre GL for hazard zonation heatmaps, 3D slope rendering, sensor telemetry, and automated evacuation routing.
4. **Resilient Mobile App (Offline-First)**: Flutter-based citizen & rescue crew app with SQLite offline map caching, crowdsourced incident reporting, and emergency SOS.
5. **Multi-Channel Alert Dispatcher**: Twilio/SMS gateway for remote hill villages without internet + Firebase Cloud Messaging (FCM) push alerts.

---

## 🏛️ Monorepo Architecture

```
sih-landslide-ner/
├── backend/       # FastAPI + PostGIS + Redis + Celery (Core REST API & Worker)
├── ml-engine/     # Python ML/AI microservice (Risk scoring, XGBoost, PyTorch)
├── frontend/      # Next.js 14 + MapLibre GL / Leaflet (GIS Dashboard)
├── mobile/        # Flutter app with SQLite offline sync & SOS alerts
├── infra/         # Docker Compose, K8s manifests, DB init scripts
└── docs/          # Architecture diagrams, data source specs, SIH demo guide
```

---

## ⚡ Quickstart (All Services with Docker Compose)

### 1. Prerequisites
- [Docker Engine & Docker Compose](https://www.docker.com/) (v24+)
- Node.js 18+ (for local frontend dev)
- Python 3.10+ (for local backend/ML dev)
- Flutter 3.16+ (for mobile app dev)

### 2. Launch Local Environment
```bash
# Clone and enter directory
cd sih-landslide-ner

# Copy sample environment configuration
cp infra/.env.example .env

# Spin up all containers (PostGIS, Redis, ML Engine, FastAPI Backend, Celery, Frontend)
docker compose -f infra/docker-compose.yml up --build -d
```

### 3. Verify Running Services
| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **GIS Web Dashboard** | `http://localhost:3000` | Citizen & Authority Live GIS Dashboard |
| **FastAPI Backend Docs** | `http://localhost:8000/docs` | Swagger / OpenAPI Explorer |
| **Backend Health** | `http://localhost:8000/api/v1/health` | Backend status & DB connection check |
| **ML Engine Prediction API** | `http://localhost:8001/docs` | ML inference microservice docs |
| **PostGIS Spatial DB** | `localhost:5432` (`db: landslide_ner`) | Spatially indexed GIS database |
| **Redis Broker** | `localhost:6379` | Queue for Celery alert evaluation jobs |

---

## 🛰️ Real-World Data Pipeline Integration Plan

| Data Source | Provider | Frequency | Status in Scaffolding |
| :--- | :--- | :--- | :--- |
| **Antecedent Precipitation** | IMD AWS & Doppler Radar / GPM | Hourly / Daily | Mocked with realistic Meghalaya & Sikkim rainfall profiles |
| **Digital Elevation Model (DEM)** | NASA SRTM 30m / Copernicus 30m | Static Baseline | Pre-computed slope & aspect matrices |
| **SAR Surface Displacement** | Sentinel-1 InSAR / Google Earth Engine | 6-12 days | Mocked ground movement velocities (mm/yr) |
| **Geological & Landslide Inventory** | Geological Survey of India (GSI) | Historical baseline | 1,000+ seeded historical landslide coordinates |
| **IoT Ground Sensors** | Rain gauges, Piezometers, Inclinometers | Real-time (1-5 min) | Synthetic telemetry streamer included |

---

## 🏆 SIH 2026 Evaluation Highlights
- **Offline-First Resilience**: Mobile app operates seamlessly in remote hill villages with zero network, syncing automatically upon reconnecting.
- **Multilingual Early Warning**: Automated alerts dispatched in English, Hindi, Assamese, Bengali, and local tribal dialects.
- **Microservice Decoupling**: AI model retraining and inference operate independently from high-concurrency alert dispatch.
- **Open Standards**: Fully compliant with OGC (Open Geospatial Consortium) GeoJSON, WMS, and WFS standards.

---

## 📜 License & Acknowledgments
Built for **Smart India Hackathon 2026** under the auspices of **Ministry of Development of North Eastern Region (MDoNER)**.
