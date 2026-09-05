# 🗺️ Frontend: Next.js 14 + MapLibre GIS Dashboard

## 📌 Kya Banaya Gaya Hai (Overview)
Yeh portal disaster management authorities aur common citizens ke liye central command view hai:
1. **Interactive GIS Map Viewer**: MapLibre GL ke jariye real-time heatmaps aur hazard zonation polygons (EPSG:4326 GeoJSON) render karta hai.
2. **Emergency Alert Ticker & Banner**: RED / ORANGE / YELLOW alerts ko live ticker ke roop mein display karta hai.
3. **Telemetry & Sensor Widgets**: Rainfall rate (mm/hr), soil saturation (%), aur InSAR ground displacement rates ka live visual indicator.
4. **Resilient Offline / Mock Fallback**: Backend offline hone par bhi standalone state mein NER hotspots visualize kar sakta hai.

---

## 🚀 Kaise Chalayein (Local & Docker)

### Option A: Via Docker Compose
```bash
cd ../infra
docker compose up frontend -d
```

### Option B: Local Node.js Development
```bash
cd frontend

# Dependencies install karein
npm install

# Dev server chalu karein
npm run dev
```

Dashboard access karein: `http://localhost:3000`

---

## 🛰️ Real Data Source Integration Plan (Baad Mein Connect Karne Ke Liye)

| Layer | Real Geospatial Source | Integration Route |
| :--- | :--- | :--- |
| **Satellite Base Map** | ISRO Bhuvan Satellite Tiles / Mapbox / OpenStreetMap | Configure `NEXT_PUBLIC_MAPLIBRE_STYLE` with ISRO WMS tile endpoint. |
| **Real-time Hazard Polygons** | FastAPI Backend `/api/v1/risk-zones` | Fetched via SWR / React Query every 60 seconds. |
| **Evacuation Routes** | OpenRouteService (ORS) / Google Directions API | Renders optimal uphill/safe escape routes avoiding red-flagged slopes. |
| **Doppler Radar Cloudburst Overlay** | IMD Radar Composite Tiles | WMS layer overlay on MapLibre canvas. |
