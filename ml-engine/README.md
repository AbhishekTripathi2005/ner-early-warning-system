# 🧠 AI/ML Prediction Engine & Data Pipelines (Phases 1 & 2)

## 📌 Overview
Yeh engine multi-modal geospatial data ingest karta hai aur hybrid prediction models ke jariye real-time landslide risk evaluate karta hai:
1. **Data Ingestion Layer (`/ingestion`)**: IMD AWS, Sentinel-1 InSAR, SRTM 30m DEM, GSI Bhukosh, aur NASA SMAP.
2. **Synthetic NER Dataset (`/data`)**: 800 georeferenced records across the 8 North Eastern states.
3. **Baseline ML Models (`/baseline`)**: Random Forest aur XGBoost binary classifiers (Precision: 0.71, Recall: 0.70, ROC-AUC: 0.78).
4. **Static Susceptibility (`/susceptibility`)**: Calibrated terrain, lithology, and land-use susceptibility scoring.
5. **Dynamic Nowcasting (`/nowcast`)**: PyTorch LSTM for 2-6h rapid slope failure nowcasting + 24-48h weather forecast risk.
6. **Spatiotemporal Road Network GNN (`/spatiotemporal`)**: Graph risk propagation across NER arterial lifelines (NH-10, NH-106, NH-6) to detect severed settlements.
7. **Explainability with SHAP (`/explainability`)**: Converts quantitative TreeSHAP values into plain natural language sentences in **Hindi** and **English**.
8. **Feedback Loop (`/feedback_loop`)**: Retraining pipeline incorporating ground-truth verification from field officers.

---

## 🛠️ Asli Data Se Replace Karne Ka Guide (Real Data Replacement)

Agar aapko mock/simulated data ko **official government / satellite APIs** se replace karna hai, toh niche di gayi files mein designated changes karein:

| Data Source | Edit File | Kya Badlein / Kaise Connect Karein |
| :--- | :--- | :--- |
| **IMD Rainfall API** | `ml-engine/ingestion/imd_fetcher.py` | `self.api_key` mein apna data.gov.in / IMD Pune API token daalein. Line 40 par commented `requests.get` call ko uncomment karein. |
| **Google Earth Engine (GEE)** | `ml-engine/ingestion/gee_sentinel_fetcher.py` | `service_account` aur `private_key_path` configure karein. `ee.Initialize()` call uncomment karke active Copernicus Collection (`COPERNICUS/S1_GRD`) se InSAR displacement extract karein. |
| **SRTM / DEM 30m** | `ml-engine/ingestion/dem_processor.py` | USGS EarthExplorer / Bhuvan se downloaded GeoTIFF path pass karein. `rasterio.open(path)` se actual slope/aspect matrix compute karein. |
| **GSI Landslide Inventory** | `ml-engine/ingestion/gsi_inventory_loader.py` | GSI Bhukosh portal se export ki gayi CSV ka path `load_and_clean(filepath)` mein pass karein. |
| **NASA SMAP Soil Moisture** | `ml-engine/ingestion/soil_moisture_loader.py` | NSIDC NASA Earthdata token pass karke HDF5 / NetCDF raster load karein. |
| **Road Network Graph** | `ml-engine/spatiotemporal/road_network_graph.py` | OpenStreetMap Overpass API / OSM GeoJSON se NER states ke highways load karke `nx.read_shp` ya GeoPandas se graph nodes populate karein. |

---

## 🚀 Execution Commands

```bash
# 1. Dataset Generation
python data/generate_dataset.py

# 2. Baseline Model Training
python baseline/train_baseline.py

# 3. Start FastAPI ML Microservice
uvicorn src.main:app --reload --port 8001
```

Swagger API Docs: `http://localhost:8001/docs`

### Key Endpoints:
- `POST /predict/susceptibility`: Static risk + SHAP explanation (Hindi & English).
- `POST /predict/nowcast`: 2-6 hour PyTorch LSTM nowcast.
- `POST /predict/road-impact`: Road network connectivity & blocked highway report.
- `POST /feedback`: Log field officer verification.
- `POST /retrain`: Trigger automated model retraining.
