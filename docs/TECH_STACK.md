# 🛠️ Official Technical Stack & Architecture Specification
## Project: NER Landslide Early Warning & Risk Monitoring System
### Problem Statement: SIH26001 | Ministry of Development of North Eastern Region (MDoNER)

> **Document Classification**: Authoritative Engineering Reference  
> **Status**: Verified against current codebase (`git: main`)  
> **Purpose**: Provides exact library versions, file paths, model implementations, and deployment topology for technical jury evaluation.

---

## 1. Complete Technology Stack & Version Matrix

### 1.1 Frontend Dashboard & GIS Layer

| Component / Layer | Technology | Version | Location / Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js (App Router) | `14.1.3` | `frontend/package.json` | Hybrid SSR / Static web application shell |
| **UI Library** | React & React DOM | `18.2.0` | `frontend/package.json` | Component lifecycle and reactive state |
| **Language** | TypeScript | `5.4.2` | `frontend/package.json` | Strict type safety across all components |
| **Styling** | Tailwind CSS | `3.4.1` | `frontend/package.json` | Custom dark-slate command center styling |
| **GIS Mapping** | Leaflet | `1.9.4` | `frontend/package.json` | Interactive 2D multi-layer GIS viewer |
| **Basemap Provider** | Esri World Dark Gray Canvas | REST Tiles | `HeatmapViewer.tsx` | Watermark-free, zero-API-key basemap & reference |
| **Time-Series Charts** | Recharts | `3.10.1` | `frontend/package.json` | Dual-axis rainfall vs. LSI risk score graphs |
| **Iconography** | Lucide React | `0.358.0` | `frontend/package.json` | Tactical telemetry and status badges |
| **Offline Cache** | Service Worker API | W3C Standard | `frontend/public/sw.js` | App shell and Esri map tile precaching |
| **Offline Storage** | IndexedDB API | Native W3C | `frontend/src/lib/offlineDb.ts` | Local queue for offline citizen reports & logs |
| **Voice Audio (TTS)** | Web Speech API (`SpeechSynthesis`) | Browser Native | `AlertBanner.tsx` | Spoken emergency bulletins for low-literacy users |
| **Audio Synthesizer** | Web Audio API (`AudioContext`) | Browser Native | `EvacuationSirenModal.tsx` | Synthesizes emergency evacuation siren chirps |

---

### 1.2 Backend REST API & Asynchronous Queue

| Component / Layer | Technology | Version | Location / Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **API Framework** | FastAPI | `0.110.0+` | `backend/requirements.txt` | High-throughput asynchronous REST API endpoints |
| **ASGI Web Server** | Uvicorn | `0.28.0+` | `backend/requirements.txt` | Async server runtime on port 8000 |
| **Data Validation** | Pydantic & Pydantic-Settings | `2.6.0+` | `backend/requirements.txt` | Strict request/response payload schemas |
| **Database** | PostgreSQL + PostGIS | `Postgres 15` / `PostGIS 3.3` | `infra/docker-compose.yml` | Spatially indexed relational spatial database |
| **ORM Layer** | SQLAlchemy & GeoAlchemy2 | `SQLAlchemy 2.0+` / `GeoAlchemy2 0.14+` | `backend/requirements.txt` | Async spatial query abstraction (EPSG:4326) |
| **Database Driver** | asyncpg & psycopg2-binary | `asyncpg 0.29+` / `psycopg2 2.9+` | `backend/requirements.txt` | Async PostgreSQL database communication |
| **DB Migrations** | Alembic | `1.13.1+` | `backend/requirements.txt` | Database schema version control |
| **Message Broker** | Redis | `7-alpine` | `infra/docker-compose.yml` | Celery job broker and in-memory cache on port 6379 |
| **Task Queue** | Celery | `5.3.6+` | `backend/requirements.txt` | Background periodic alert evaluation worker |

---

### 1.3 Machine Learning & GeoAI Microservice

| Component / Layer | Technology | Version | Location / Source | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Microservice Framework**| FastAPI + Uvicorn | `FastAPI 0.110+` | `ml-engine/src/main.py` | Independent ML inference microservice (Port 8001) |
| **Gradient Boosting** | XGBoost | `2.0.3+` | `ml-engine/requirements.txt` | Static Landslide Susceptibility Index (LSI) classifier |
| **Ensemble Learning** | Scikit-Learn | `1.4.1+` | `ml-engine/requirements.txt` | Random Forest baseline, preprocessors, pipelines |
| **Deep Learning** | PyTorch (CPU build) | `2.2.0+` | `ml-engine/requirements.txt` | 2-layer LSTM short-term dynamic nowcaster |
| **Graph Analysis** | NetworkX | `3.2+` | `ml-engine/spatiotemporal/` | Arterial highway graph disruption and reachability |
| **Scientific Stack** | NumPy & Pandas | `numpy 1.26+` / `pandas 2.2+` | `ml-engine/requirements.txt` | Geotechnical matrix transformation and data manipulation |
| **Model Serialization** | Joblib | `1.3.2+` | `ml-engine/requirements.txt` | Persistent `.joblib` binary pipeline storage |

---

## 2. Machine Learning Modules & File Implementations

The following table provides the **exact file paths** and classes for every mathematical and machine learning model in the repository:

| Model Function | Model Type / Architecture | Python Module Path | Core Class / Function | Saved Model Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **Static Susceptibility (LSI)** | XGBoost Classifier (`XGBClassifier`) | `ml-engine/susceptibility/susceptibility_model.py` | `StaticSusceptibilityModel` | `ml-engine/baseline/artifacts/baseline_xgb_model.joblib` |
| **Baseline Benchmark** | Random Forest Classifier (`RandomForestClassifier`) | `ml-engine/baseline/train_baseline.py` | `train_baseline_models()` | `ml-engine/baseline/artifacts/baseline_rf_model.joblib` |
| **Short-Term Nowcast (2-6h)** | 2-Layer PyTorch LSTM Neural Network | `ml-engine/nowcast/lstm_nowcast.py` | `LandslideLSTM`, `DynamicNowcaster` | Initialized PyTorch tensor weights with physics calibration |
| **Medium-Term Forecast (24-48h)** | Empirical Hydro-Meteorological Load Index | `ml-engine/nowcast/forecast_model.py` | `WeatherForecastRiskModel` | Deterministic equation: `load_index = 0.5(P/250) + 0.3(S/100) + 0.2(Slope/60)` |
| **Road Isolation Graph** | Graph Reachability Algorithm (`nx.has_path`) | `ml-engine/spatiotemporal/road_network_graph.py` | `RoadNetworkRiskPropagator` | In-memory NetworkX Graph (13 nodes, 11 arterial segments) |
| **Feature Attribution** | TreeSHAP-aligned attribution model | `ml-engine/explainability/shap_explainer.py` | `LandslideSHAPExplainer` | Standardized feature offset model based on training means |
| **Multilingual Explainer** | Natural Language Generation Engine | `ml-engine/explainability/natural_language_explainer.py`| `NaturalLanguageExplainer` | Rule-based Hindi (`hi`) and English (`en`) sentence builder |
| **Continuous Retraining Loop** | Ground-truth append & refit pipeline | `ml-engine/feedback_loop/retrain_pipeline.py` | `FieldFeedbackRetrainer` | Appends verified rows to CSV and re-executes `train_baseline_models()` |

---

## 3. Deployment Topology & Infrastructure

### 3.1 Production Web Staging (Currently Live)
- **Host**: Vercel Global Edge Network
- **Repository**: `https://github.com/AbhishekTripathi2005/ner-early-warning-system.git`
- **Branch**: `main`
- **Build Command**: `next build` (Root Directory: `frontend`)
- **Output Mode**: Static HTML / Client-side PWA with dynamic client hydration
- **Live URL**: `https://ner-early-warning-system.vercel.app` (or active Vercel domain)
- **Offline Capabilities**: Standalone Service Worker (`/sw.js`) and IndexedDB allow the deployed web dashboard to operate during internet dropouts.

### 3.2 Full-Stack Local Containerization (Docker Compose)
- **Configuration File**: `infra/docker-compose.yml`
- **Container Network**: `ner_disaster_net` (Bridge)
- **Services**:
  1. `postgis` (Port 5432): `postgis/postgis:15-3.3-alpine`
  2. `redis` (Port 6379): `redis:7-alpine`
  3. `ml-engine` (Port 8001): Custom Dockerfile building `ml-engine/` on Python 3.10 slim
  4. `backend` (Port 8000): Custom Dockerfile building `backend/` on Python 3.10 slim
  5. `celery-worker`: Background worker executing periodic risk evaluation tasks

### 3.3 Government Cloud Staging Target (NIC MeghRaj)
- **Target Environment**: National Informatics Centre (NIC) MeghRaj Cloud / Kubernetes
- **Manifests Location**: `infra/k8s/`
- **Architecture**: Stateless API replicas behind an Ingress controller, managed PostgreSQL cluster with PostGIS extension, persistent volume claims for model artifacts.
