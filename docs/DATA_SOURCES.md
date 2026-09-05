# 🛰️ Geospatial & Meteorological Data Sources Reference Guide

This document specifies the exact real-world data sources, APIs, access tokens, and integration pipelines planned for the **AI-Based Early Warning and Landslide Risk Monitoring System in NER**.

---

## 1. Meteorological & Precipitation Data

### A. Indian Meteorological Department (IMD) AWS Network
- **Data Provided**: Real-time Automatic Weather Station (AWS) surface observations (Hourly rainfall, temperature, relative humidity, wind speed).
- **Access Protocol**: REST API via IMD Pune / Mausam Portal (GeoJSON & CSV format).
- **Update Frequency**: Every 15 to 60 minutes.
- **NER Focus Stations**: Cherrapunji, Mawsynram, Shillong (Meghalaya), Gangtok, Singtam (Sikkim), Haflong (Assam).
- **Fallback / Alternative**: NASA Global Precipitation Measurement (GPM) IMERG Early Run (0.1° resolution, available every 30 minutes).

---

## 2. Satellite Remote Sensing & Synthetic Aperture Radar (SAR)

### A. Sentinel-1 SAR (InSAR Ground Displacement)
- **Data Provided**: C-band Synthetic Aperture Radar (Interferometric Wide Swath - IW SLC).
- **Primary Use**: Measuring slow-moving slope deformation, creep rates, and active subsidence along steep road cuts.
- **Provider**: European Space Agency (ESA) Copernicus Data Space Ecosystem.
- **Update Frequency**: 6-12 day repeat cycle per orbit pass.
- **API Endpoint**: `https://dataspace.copernicus.eu/api/` (OData and OpenSearch).

### B. Sentinel-2 Multispectral Optical Imagery
- **Data Provided**: 10m visible, near-infrared (NIR), and shortwave infrared (SWIR) bands.
- **Primary Use**: Calculating Normalized Difference Vegetation Index (NDVI) and Normalized Difference Moisture Index (NDMI) to detect slope scarp formation and devegetation.
- **Provider**: Copernicus Open Access Hub / Google Earth Engine.

---

## 3. Topographic & Geomorphological Data

### A. Digital Elevation Models (DEM)
- **Source**: NASA SRTM 30m Global Elevation or Copernicus DEM GLO-30.
- **Derived Terrain Features**:
  - Slope angle ($\beta$ in degrees)
  - Slope aspect (direction facing)
  - Profile and Plan Curvature
  - Topographic Wetness Index (TWI): $\text{TWI} = \ln(a / \tan\beta)$
- **Storage**: Raster GeoTIFF stored in object storage (AWS S3 / MinIO) with Cloud Optimized GeoTIFF (COG) formatting for high-speed windowed reads via `rasterio`.

---

## 4. Geological & Historical Ground Truth

### A. Geological Survey of India (GSI) Bhukosh
- **Data Provided**: National Landslide Susceptibility Mapping (NLSM) macro-zonation polygons and historical landslide occurrence database (date, coordinates, triggering rainfall, fatalities).
- **Integration**: Ground truth labels used to train and calibrate supervised XGBoost and Random Forest classifiers.
- **Format**: ESRI Shapefiles converted to PostGIS geometry via `ogr2ogr` / `GeoPandas`.

---

## 5. In-Situ Geotechnical IoT Telemetry (Ground Sensors)

### A. Smart Sensor Node Mesh
- **Sensor Types**:
  - Piezometers: Pore-water pressure in saturated sub-surface strata.
  - Tilt Inclinometers: 3-axis angular deviation along critical road cuttings.
  - Optical Tipping-Bucket Rain Gauges: Hyperlocal rainfall intensity.
- **Communication Protocol**: MQTT / LoRaWAN gateway forwarding to Backend via HTTPS webhook.
- **Update Frequency**: 1 to 5 minutes during active storm conditions.
