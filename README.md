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
3. **Interactive GIS Web Dashboard**: Next.js + Esri Dark Gray Canvas GIS (Watermark-Free) for hazard zonation heatmaps, 3D slope rendering, sensor telemetry, and automated evacuation routing.
4. **Offline & Low-Network Resilience**: Service Worker (`/sw.js`) + IndexedDB caching for GIS tiles and offline queueing for citizen hazard reports.
5. **Multi-Channel Alert Dispatcher**: Web Audio evacuation siren synthesizer + SMS broadcast simulator + Browser Web Speech API text-to-speech voice bulletins.

---

## 🚀 Recent Changelog & SIH26001 Problem Statement Coverage

| # | Feature / PS Requirement | Implementation & Architectural Solution | Target Files |
| :- | :--- | :--- | :--- |
| **1** | **Offline / Low-Network Mode** | Added Service Worker (`public/sw.js`) to cache app shell & Esri GIS tiles. Created native IndexedDB storage (`src/lib/offlineDb.ts`) to persist alerts, roads, and queue offline citizen reports. Created `OfflineStatusBadge.tsx` with auto-sync on reconnect. | `sw.js`, `offlineDb.ts`, `OfflineStatusBadge.tsx`, `page.tsx` |
| **2** | **Video Hazard Reporting** | Expanded hazard reporting to support both photo and short video clips (15-20s limit). Added duration validation, auto-GPS coordinate acquisition (`navigator.geolocation`), and 1-click video sample preset. Video playback supported in map popups and review panel. | `CitizenReportModal.tsx`, `HeatmapViewer.tsx`, `OfficerReviewPanel.tsx` |
| **3** | **Weather-Linked 24-48h Forecast** | Built interactive Recharts dual-axis ComposedChart visualizing 6h Nowcast, 24h Cumulative, and 48h Outlook. Plots Rainfall Intensity (mm/h) on Left Y-Axis against Landslide Susceptibility Index (0.00-1.00) on Right Y-Axis with 0.70 severe threshold reference line. | `WeatherForecastWidget.tsx` |
| **4** | **Response Prioritization Tab** | Ranked list and decision table strictly formatted per requirement: `Sector X: Priority 1 — N villages isolated, M population affected`. Features multi-factor sorting by Priority Rank, Cut-Off Villages, Population at Risk, and AI LSI Score. | `ResponsePrioritizationList.tsx` |
| **5** | **Road-Isolation Impact** | Added `villagesIsolated`, `isolatedVillages`, and `populationAffected` fields to all highway corridor cards. Features high-visibility alert banners identifying cut-off Himalayan hamlets (e.g. 5 hamlets cut off along NH-10; 3 hamlets cut off on SH-5). | `RoadStatusPanel.tsx` |
| **6** | **Continuous Learning Feedback** | Added officer ground-truth validation panel allowing officers to flag alerts as `CONFIRMED (TP)`, `FALSE_ALARM (FP)`, or `MISSED_EVENT (FN)`. Created `AlertFeedbackLog` SQLAlchemy model & FastAPI endpoints (`/api/v1/alerts/feedback`), cached locally in IndexedDB. | `landslide.py`, `alerts.py`, `OfficerReviewPanel.tsx` |
| **7** | **Voice Alert (Text-to-Speech)** | Added "🔊 Listen" button to all alert cards using browser Web Speech API (`window.speechSynthesis`). Speaks localized emergency bulletins in English, Hindi, Assamese, Bodo, and Khasi for low-literacy field users. Includes audio sound-wave animations. | `AlertBanner.tsx` |
| **8** | **Multilingual Coverage (Bodo & Khasi)** | Added full i18n support for Bodo (`brx` / बर' राव) and Khasi (`kha` / Ka Ktien Khasi) alongside English, Hindi, and Assamese. All 5 languages accessible via the top command center switcher. | `i18n.ts`, `page.tsx` |
| **9** | **Mobile Responsiveness (375px)** | Optimized layout for iPhone SE / 375px mobile viewports: scrollable tab bar, flex wrapping in header, responsive font sizes, touch-friendly Leaflet controls, and zero horizontal page overflow. | `page.tsx`, `globals.css` |

---

## 🏛️ Monorepo Architecture

```
sih-landslide-ner/
├── backend/       # FastAPI + PostGIS + SQLAlchemy (Core REST API, Alerts & Feedback)
├── ml-engine/     # Python ML/AI microservice (Risk scoring, XGBoost, PyTorch)
├── frontend/      # Next.js 14 + Recharts + Leaflet (Esri Dark Gray GIS Dashboard)
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

### 2. Local Frontend Dev
```bash
cd sih-landslide-ner/frontend
npm install
npm run dev
# Dashboard accessible at http://localhost:3000
```

### 3. Verify Running Services
| Service | Endpoint / URL | Purpose |
| :--- | :--- | :--- |
| **GIS Web Dashboard** | `http://localhost:3000` | Citizen & Authority Live GIS Dashboard |
| **FastAPI Backend Docs** | `http://localhost:8000/docs` | Swagger / OpenAPI Explorer |
| **Backend Health** | `http://localhost:8000/api/v1/health` | Backend status & DB connection check |
| **ML Engine Prediction API** | `http://localhost:8001/docs` | ML inference microservice docs |
| **PostGIS Spatial DB** | `localhost:5432` (`db: landslide_ner`) | Spatially indexed GIS database |

---

## 🏆 SIH 2026 Evaluation Highlights
- **Watermark-Free Esri GIS**: World Dark Gray Base & Reference vector tiles with smooth regional camera jump shortcuts.
- **Offline-First Field Resilience**: Service worker precaches app shell and map tiles; citizen reports queue locally in IndexedDB during network failure and auto-sync on reconnect.
- **Crowdsourced Photo & Video Reporting**: Verified ground truth with GPS auto-tagging and AI spatial correlation scoring.
- **Multilingual Early Warning**: 5 languages supported: English, Hindi, Assamese, Bodo (बर'), and Khasi.
- **Continuous Learning Loop**: Officer ground-truth feedback logs directly feed back into retraining pipelines.

---

## 📜 License & Acknowledgments
Built for **Smart India Hackathon 2026** under the auspices of **Ministry of Development of North Eastern Region (MDoNER)**.
