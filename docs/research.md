# 🔬 Research & Requirements Specification Document
> **Project**: AI-Based Early Warning and Landslide Risk Monitoring System in North Eastern Region (NER)  
> **Problem Statement ID**: SIH26001 | **Ministry**: Ministry of Development of North Eastern Region (MDoNER)  
> **Theme**: Disaster Management | **Category**: Software  
> **Document Status**: Production Verified Baseline  

---

## 1. Problem Statement Executive Summary

Landslides in the North Eastern Region (NER) of India represent an annual recurring catastrophe, causing loss of human lives, destruction of critical infrastructure, isolation of entire hill communities, and severe economic disruption. The Ministry of Development of North Eastern Region (MDoNER) requires a modern, cloud-based early warning and continuous risk monitoring platform capable of handling the extreme geo-climatic realities of the region.

### Core System Capabilities:
1. **Multi-Modal Data Ingestion**:
   - Rainfall (real-time AWS + radar + satellite)
   - Soil moisture saturation profiles (NASA SMAP / in-situ piezometers)
   - Earth observation satellite imagery (Sentinel-1 SAR InSAR creep + Sentinel-2 optical NDVI)
   - Terrain and elevation models (NASA SRTM 30m DEM for slope, aspect, curvature, and TWI)
   - Historical landslide inventory (Geological Survey of India - GSI Bhukosh records)
2. **AI/ML High-Risk Zone Detection & Nowcasting**:
   - Landslide Susceptibility Index (LSI) computation combining static geology and dynamic precipitation
   - Dynamic 2-6 hour short-term nowcasting (PyTorch LSTM) and 24-48 hour weather-linked forecast modeling
   - Spatiotemporal graph network propagation across arterial hill highways (NH-10, NH-106, NH-29)
3. **Multi-Channel Alert Dissemination**:
   - Automated push notifications via Firebase Cloud Messaging (FCM)
   - Telecom-grade SMS sirens via CDAC / Twilio for remote 2G hill hamlets without internet
4. **Interactive GIS Command Center**:
   - MapLibre GL / Leaflet spatial heatmap and hazard zonation layers
   - Arterial highway connectivity status with automated detour recommendations
5. **Crowdsourced Citizen Reporting**:
   - Geo-tagged incident submissions with photo attachments and on-device TFLite Computer Vision crack analysis
6. **Multilingual & Offline-First Resilience**:
   - Operates in complete connectivity blackouts via local SQLite caching and auto-sync on network recovery
   - Full multilingual support across regional languages: **English, Hindi (हिन्दी), and Assamese (অসমীয়া)** with hooks for Khasi, Garo, Bodo, and Manipuri.

---

## 2. NER-Specific Geo-Technical & Operational Challenges

| Challenge Category | Problem Description in NER | Architectural Mitigation in this Platform |
| :--- | :--- | :--- |
| **Sparse Sensor Infrastructure** | Ground Automatic Weather Stations (AWS) and geotechnical sensors are sparse across rugged terrain in Arunachal, Nagaland, and Mizoram. | **Multi-Source Data Fusion**: Satellite precipitation (NASA GPM IMERG) and synthetic satellite radar (Sentinel-1 InSAR) bridge spatial observation gaps between physical ground stations. |
| **Connectivity & Power Blackouts** | Severe monsoons snap optical fiber lines, down cell towers, and knock out power grids, leaving mountain hamlets completely isolated. | **Offline-First Architecture**: Mobile app stores hazard maps, safe shelters, and reports in local SQLite storage. Failover to cellular SMS / GSM signaling when data networks drop. |
| **Linguistic & Cultural Diversity** | NER is home to over 200 distinct ethnic groups and languages. English/Hindi-only alerts fail to drive immediate evacuation. | **Multilingual Alert Engine**: Localized text/audio alerts in Assamese, Bodo, Khasi, Mizo, Manipuri, Bengali, and Hindi with universal color and icon cues. |
| **Extreme Monsoon Intensity** | Orographic cloudbursts (>50 mm/hr) in Cherrapunji/Mawsynram saturate slopes rapidly (>11,000 mm/yr annual rain). | **Dynamic Saturated-Soil Thresholds**: Thresholds dynamically scale down based on antecedent 72-hour moisture saturation. |
| **Fragile Himalayan Geology** | Tectonically hyper-active zone (Seismic Zone V) with steep sheared sedimentary rock prone to rapid liquefaction. | **Geological Lithology Weighting**: Integrates GSI lithological fault and shear maps into the machine learning feature pipeline. |

---

## 3. Official & Free Government Data Sources Table

> [!NOTE]
> All sources listed below are official, free, open government and research datasets verifiable by SIH judges.

| Data | Source | Link / Method | Update Frequency |
| :--- | :--- | :--- | :--- |
| **Rainfall (real-time + historical)** | IMD (India Meteorological Department) | `data.gov.in`, IMD Pune API/portal (`https://mausam.imd.gov.in/`), IMD Automatic Weather Station data | Hourly / 15-Minute |
| **Satellite rainfall (backup/gap-fill)** | NASA GPM / IMERG | GES DISC (NASA Earthdata) (`https://disc.gsfc.nasa.gov/datasets/GPM_3IMERGHHE_06/`) | Half-hourly (Early Run, 4h latency) |
| **Satellite imagery (SAR & Optical)** | Sentinel-1 (SAR) & Sentinel-2 (Optical) | Copernicus Open Access Hub / Google Earth Engine (`https://dataspace.copernicus.eu/`) | 5 to 12 Days repeat orbit |
| **Terrain / DEM (slope, elevation, aspect)** | SRTM 30m DEM | USGS EarthExplorer (`https://earthexplorer.usgs.gov/`) or Bhuvan (ISRO) | Static Baseline (30m spatial resolution) |
| **Historical landslide records** | GSI (Geological Survey of India) Landslide Inventory | GSI Bhukosh portal / National Landslide Susceptibility Mapping (`https://bhukosh.gsi.gov.in/`) | Decadal Baseline / Periodic Updates |
| **Soil moisture** | NASA SMAP | NSIDC (National Snow and Ice Data Center) (`https://nsidc.org/data/smap`) | Daily Global Composites |
| **Road network** | OpenStreetMap (OSM) | Overpass API / OSM export for NER states (`https://overpass-turbo.eu/`) | Continuous / On-demand |
| **Village / population data** | Census of India | `censusindia.gov.in` (District / Village Demographic Census) | Decadal Baseline |
| **State-level disaster data** | State DMAs | ASDMA (Assam), Manipur SDMA, Sikkim SDMA, Meghalaya SDMA portals | Event-driven / Monsoon bulletins |
| **Land use / geology** | Bhuvan (ISRO) thematic layers | `bhuvan.nrsc.gov.in` (ISRO National Land Use / Land Cover Mapping) | Annual / Thematic updates |

---

## 4. Hardware & Deployment Recommendations
- **Edge Deployment**: Raspberry Pi 4 / Jetson Nano for hill-top AWS gateway processing with LoRaWAN mesh communication.
- **Server Deployment**: Dockerized microservices orchestrating PostGIS, Redis, Celery, FastAPI, and Next.js.
