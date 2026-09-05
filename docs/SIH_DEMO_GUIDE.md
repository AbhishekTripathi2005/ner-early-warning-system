# 🏆 Smart India Hackathon 2026: Live Demo & Judge Presentation Guide
> **Problem Statement ID**: SIH26001  
> **Ministry**: Ministry of Development of North Eastern Region (MDoNER)  
> **Theme**: Disaster Management | **Category**: Software  
> **Title**: AI-Based Early Warning and Landslide Risk Monitoring System in NER

---

## 🎯 1. 30-Second Elevator Pitch
> *"Every monsoon, landslides paralyze the North Eastern Region—cutting off arterial supply highways like NH-10 and costing precious lives. Current early warnings rely on broad weather bulletins that lack hyperlocal accuracy and fail when hill cellular connectivity collapses.*  
> *Our solution is an AI-powered, multi-tier early warning platform that fuses satellite SAR ground-creep telemetry, IMD precipitation data, and 30m topographic slope models into a real-time Landslide Susceptibility Index (LSI). Supported by an offline-first mobile app with SQLite sync and automated SMS sirens, it ensures early warnings reach the most remote hill villages even during total power and internet blackouts."*

---

## 🎬 2. 5-Minute Live Demo Flow for Judges

| Step | Time | What to Show | Key Talking Point for Judges |
| :--- | :--- | :--- | :--- |
| **1. The Command Center** | 0:00 - 1:00 | Open `http://localhost:3000` (Next.js Dashboard). Show color-coded hazard zones across Meghalaya and Sikkim. | *"Our GIS portal visualizes risk across 4 hazard tiers: Green, Yellow, Orange, and Red, backed by WGS 84 PostGIS polygons."* |
| **2. Dynamic AI Prediction** | 1:00 - 2:15 | Open `http://localhost:8001/docs` (ML Microservice). Run a `/predict` call with 44° slope and 260mm rainfall. | *"Unlike static thresholds, our XGBoost model dynamically weights soil moisture history, steepness, and InSAR satellite displacement."* |
| **3. Automated Sirens & Celery** | 2:15 - 3:15 | Show Celery background tasks and trigger `/api/v1/alerts/broadcast`. | *"When critical thresholds cross, Celery workers instantly dispatch geo-targeted SMS broadcasts without delaying the API server."* |
| **4. Offline Mobile App** | 3:15 - 4:15 | Show Flutter mobile app with simulated Airplane Mode / Offline mode. Open cached safe shelters. | *"Even if mobile towers go dark during a cloudburst, our local SQLite database allows villagers to find the nearest relief camp and trigger SMS SOS."* |
| **5. Production Architecture** | 4:15 - 5:00 | Show `docker-compose.yml` and Kubernetes manifests in `infra/k8s`. | *"The system is fully containerized, microservice-based, and ready for rapid deployment across all 8 North Eastern states."* |

---

## 💡 3. Key Differentiators to Emphasize
1. **Offline-First Resilience**: Specifically solves the hill-station communication breakdown problem.
2. **Multi-Sensor Data Fusion**: Combines Space-borne (Sentinel-1 InSAR), Atmospheric (IMD), Topographic (SRTM DEM), and In-Situ ground sensors.
3. **Decoupled Architecture**: High-speed FastAPI + Celery ensures the system never crashes under heavy citizen traffic.
4. **MDoNER Alignment**: Specifically customized for the geology, rainfall extremes, and road networks of the North Eastern Region of India.
