import os
import shutil
from fpdf import FPDF

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")
PUBLIC_DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "docs")
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(PUBLIC_DOCS_DIR, exist_ok=True)

class TechDocPDF(FPDF):
    def __init__(self, doc_title, orientation="P"):
        super().__init__(orientation=orientation, unit="mm", format="A4")
        self.doc_title = doc_title
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(100, 116, 139)
        self.cell(0, 5, "SIH 2026 | PS ID: SIH26001 (MDoNER) | Engineering Reference", border=0, align="L")
        self.cell(0, 5, self.doc_title, border=0, align="R")
        self.ln(6)
        self.set_draw_color(2, 132, 199)
        self.set_line_width(0.5)
        self.line(self.get_x(), self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 5, f"Page {self.page_no()} | Technical Jury Verification | Live PWA: ner-early-warning-system.vercel.app", border=0, align="C")

    def section_heading(self, text):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(2, 132, 199)
        self.cell(0, 6, text, ln=True)
        self.ln(1)

    def sub_heading(self, text):
        self.set_font("Helvetica", "B", 9.5)
        self.set_text_color(15, 23, 42)
        self.cell(0, 5, text, ln=True)
        self.ln(1)

    def body_text(self, text):
        self.set_font("Helvetica", "", 8.5)
        self.set_text_color(51, 65, 85)
        self.multi_cell(0, 4.2, text)
        self.ln(2)

    def draw_table(self, headers, rows, col_widths):
        self.set_font("Helvetica", "B", 7.5)
        self.set_fill_color(241, 245, 249)
        self.set_text_color(15, 23, 42)
        self.set_draw_color(203, 213, 225)
        
        # Header row
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 6, h, border=1, fill=True, align="L")
        self.ln()
        
        # Rows
        self.set_font("Helvetica", "", 7.2)
        self.set_text_color(51, 65, 85)
        for r_idx, row in enumerate(rows):
            fill = (r_idx % 2 == 1)
            self.set_fill_color(248, 250, 252) if fill else self.set_fill_color(255, 255, 255)
            # Find max height needed for row
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 5.5, str(cell)[:55], border=1, fill=fill, align="L")
            self.ln()
        self.ln(3)

# 1. Tech Stack PDF
def build_tech_stack_pdf():
    pdf = TechDocPDF("TECH STACK SPECIFICATION")
    pdf.add_page()
    
    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, "NER Landslide Early Warning System - Tech Stack", ln=True)
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 4, "Authoritative Version & File Path Reference for SIH26001 Jury", ln=True)
    pdf.ln(3)

    pdf.section_heading("1. Frontend Dashboard & GIS Stack")
    headers = ["Layer", "Technology", "Version", "Path / Source", "Purpose"]
    rows = [
        ["Core Framework", "Next.js App Router", "14.1.3", "frontend/package.json", "SSR / PWA web client shell"],
        ["UI Library", "React / React DOM", "18.2.0", "frontend/package.json", "Reactive state & lifecycle"],
        ["Language", "TypeScript", "5.4.2", "frontend/package.json", "Strict static type safety"],
        ["Styling", "Tailwind CSS", "3.4.1", "tailwind.config.ts", "Dark-slate command center theme"],
        ["GIS Mapping", "Leaflet", "1.9.4", "components/HeatmapViewer.tsx", "Interactive 2D spatial overlays"],
        ["Basemap", "Esri Dark Gray Canvas", "REST Tiles", "HeatmapViewer.tsx", "Watermark-free dark GIS tiles"],
        ["Time-Series", "Recharts", "3.10.1", "WeatherForecastModal.tsx", "Dual-axis rain vs. risk curves"],
        ["Offline Cache", "Service Worker API", "W3C Spec", "public/sw.js", "App shell & tile caching"],
        ["Offline DB", "IndexedDB API", "Native", "lib/offlineDb.ts", "Local queue for citizen reports"],
        ["Voice TTS", "Web Speech API", "Browser", "components/AlertBanner.tsx", "Zero-bandwidth spoken bulletins"],
        ["Audio Siren", "Web Audio API", "Browser", "EvacuationSirenModal.tsx", "Real-time acoustic alert warble"]
    ]
    pdf.draw_table(headers, rows, [25, 35, 18, 45, 57])

    pdf.section_heading("2. Backend REST API & Asynchronous Architecture")
    b_headers = ["Layer", "Technology", "Version", "Location", "Purpose"]
    b_rows = [
        ["API Framework", "FastAPI (Async)", "0.110.0+", "backend/requirements.txt", "High-throughput asynchronous REST"],
        ["ASGI Server", "Uvicorn", "0.28.0+", "backend/requirements.txt", "Async server runtime on Port 8000"],
        ["Validation", "Pydantic / Settings", "2.6.0+", "backend/app/schemas/", "Strict data validation schemas"],
        ["Database", "PostgreSQL + PostGIS", "15 / 3.3", "infra/docker-compose.yml", "Spatial indexed database (EPSG:4326)"],
        ["ORM Layer", "SQLAlchemy + GeoAlchemy2", "2.0+ / 0.14+", "backend/app/models/", "Async spatial query abstractions"],
        ["Message Broker", "Redis (Alpine)", "7-alpine", "infra/docker-compose.yml", "In-memory cache & Celery broker"],
        ["Task Queue", "Celery", "5.3.6+", "backend/app/celery_worker.py", "Background risk evaluation tasks"]
    ]
    pdf.draw_table(b_headers, b_rows, [25, 38, 20, 42, 55])

    pdf.section_heading("3. Machine Learning Microservice & File Paths")
    ml_headers = ["Function", "Model / Architecture", "Module Path", "Artifact / Status"]
    ml_rows = [
        ["Static LSI", "XGBoost Classifier", "ml-engine/susceptibility/susceptibility_model.py", "baseline_xgb_model.joblib (Trained)"],
        ["Baseline Model", "Random Forest Classifier", "ml-engine/baseline/train_baseline.py", "baseline_rf_model.joblib (Trained)"],
        ["2-6h Nowcast", "2-Layer PyTorch LSTM", "ml-engine/nowcast/lstm_nowcast.py", "Architecture ready (Awaiting seq data)"],
        ["24-48h Forecast", "Deterministic Hydro-Load", "ml-engine/nowcast/forecast_model.py", "Algorithmic Forward Model (Done)"],
        ["Road Graph", "NetworkX Reachability", "ml-engine/spatiotemporal/road_network_graph.py", "13-node topological graph (Done)"],
        ["Feature SHAP", "TreeSHAP Local Attrib.", "ml-engine/explainability/shap_explainer.py", "Local baseline feature offset (Done)"],
        ["Multilingual", "Natural Language Engine", "ml-engine/explainability/natural_language_explainer.py", "Hindi/English text engine (Done)"],
        ["Retraining", "Ground-Truth Refit", "ml-engine/feedback_loop/retrain_pipeline.py", "Automated CSV append & refit (Done)"]
    ]
    pdf.draw_table(ml_headers, ml_rows, [25, 42, 65, 48])

    pdf.section_heading("4. Deployment Topology")
    pdf.body_text(
        "- Production Web Edge: Vercel PWA (https://ner-early-warning-system.vercel.app), automated git CI/CD.\n"
        "- Container Topology: infra/docker-compose.yml orchestrates PostGIS, Redis, FastAPI backend, and ML microservice.\n"
        "- NIC MeghRaj Cloud Ready: Kubernetes deployment manifests in infra/k8s/ with zero cloud-vendor lock-in."
    )

    out_path = os.path.join(DOCS_DIR, "SIH26001_Tech_Stack_Specification.pdf")
    pdf.output(out_path)
    shutil.copy(out_path, os.path.join(PUBLIC_DOCS_DIR, "SIH26001_Tech_Stack_Specification.pdf"))
    print(f"Generated {out_path}")

# 2. Model Cards PDF
def build_model_cards_pdf():
    pdf = TechDocPDF("MODEL CARDS & EVALUATION")
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 14)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, "NER Landslide Early Warning System - AI/ML Model Cards", ln=True)
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 4, "Engineering Transparency & Verified Benchmark Evaluation", ln=True)
    pdf.ln(3)

    pdf.section_heading("1. Static Landslide Susceptibility Index (LSI) - XGBoost")
    pdf.body_text(
        "- Model Type: Gradient Boosted Decision Tree (XGBClassifier) in Scikit-Learn Pipeline\n"
        "- Module Path: ml-engine/susceptibility/susceptibility_model.py | Artifact: baseline_xgb_model.joblib\n"
        "- Training Data: 800 georeferenced synthetic samples calibrated across 8 NER morphometric zones (ml-engine/data/synthetic_landslide_ner_dataset.csv created via generate_dataset.py).\n"
        "- Split: 80% Train (640) / 20% Test (160 samples), stratified."
    )

    pdf.sub_heading("Verified Test Set Evaluation Metrics (160 Unseen Samples):")
    headers = ["Evaluation Metric", "Random Forest Baseline", "XGBoost Champion", "Winner / Note"]
    rows = [
        ["Accuracy", "68.75%", "69.37%", "XGBoost (+0.62%)"],
        ["Precision", "70.24%", "71.08%", "XGBoost (+0.84%) - Lower false alarms"],
        ["Recall (Sensitivity)", "70.24%", "70.24%", "Tied - Captures 70.2% slope hazards"],
        ["F1-Score", "70.24%", "70.66%", "XGBoost Champion"],
        ["ROC-AUC", "77.24%", "77.88%", "XGBoost (+0.64%) strong class separation"]
    ]
    pdf.draw_table(headers, rows, [40, 45, 45, 50])

    pdf.sub_heading("Key Feature Importances (Tree Gain):")
    pdf.body_text(
        "1. Dense Forest Root Cohesion: 19.15% (Protective) | 2. Barren Land / Quarry: 12.46% (Hazard)\n"
        "3. Antecedent 48h Rain: 12.33% | 4. Soil Saturation: 11.50% | 5. Slope Angle: 9.03% | 6. Road Cut: 8.87%"
    )

    pdf.section_heading("2. Dynamic 2-6h Nowcast (PyTorch LSTM)")
    pdf.body_text(
        "- Architecture: 2-Layer PyTorch LSTM (LandslideLSTM) in ml-engine/nowcast/lstm_nowcast.py\n"
        "- Input: 6-hour sequential vectors [hourly_rainfall_mm, soil_saturation_pct].\n"
        "- Training Status: ARCHITECTURE FULLY IMPLEMENTED; NOT YET TRAINED ON REAL TEMPORAL SEQUENCES.\n"
        "- Metrics: NOT YET EVALUATED (Truthful reporting: high-frequency time-series datasets for NER slopes are unavailable in open access; forward pass operates with calibrated physics surge gates)."
    )

    pdf.section_heading("3. Medium-Term 24-48h Forecast (Deterministic Load Index)")
    pdf.body_text(
        "- Implementation: ml-engine/nowcast/forecast_model.py (WeatherForecastRiskModel)\n"
        "- Formula: load_index = 0.5 * (rain_proj / 250) + 0.3 * (soil_sat / 100) + 0.2 * (slope / 60)\n"
        "- Status: Fully operational forward evaluation engine powering frontend Recharts time-series graph."
    )

    pdf.section_heading("4. Road Disruption Graph (NetworkX)")
    pdf.body_text(
        "- Implementation: ml-engine/spatiotemporal/road_network_graph.py (RoadNetworkRiskPropagator)\n"
        "- Algorithm: Deterministic Graph Reachability (nx.has_path & shortest_path); NOT a GNN.\n"
        "- Graph: 13 arterial nodal transit hubs, 11 key highway segments (NH-10, NH-6, SH-5, NH-29)."
    )

    out_path = os.path.join(DOCS_DIR, "SIH26001_Model_Cards_Evaluation.pdf")
    pdf.output(out_path)
    shutil.copy(out_path, os.path.join(PUBLIC_DOCS_DIR, "SIH26001_Model_Cards_Evaluation.pdf"))
    print(f"Generated {out_path}")

# 3. Dataset Status Matrix PDF
def build_dataset_status_pdf():
    pdf = TechDocPDF("DATASET STATUS MATRIX", orientation="L")
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, "NER Landslide Early Warning System - Parameter & Dataset Matrix", ln=True)
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 4, "Complete Breakdown of Real vs. Synthetic vs. Mock Sources for SIH Panel Evaluation", ln=True)
    pdf.ln(3)

    pdf.body_text("System Readiness Overview: 45% Live Native APIs | 30% Calibrated Synthetic Data | 25% Simulated Schema Connectors")

    headers = ["#", "Data Stream", "Current Source Type", "Current Implementation File", "Target Real-World Source", "Status"]
    rows = [
        ["1", "GIS Basemap Tiles", "REAL", "Esri World Dark Gray REST (HeatmapViewer.tsx)", "Esri / Survey of India NHP", "DONE (Live)"],
        ["2", "Landslide Susceptibility (LSI)", "SYNTHETIC (800)", "XGBoost Model (baseline_xgb_model.joblib)", "GSI Bhukosh NLSM 1:50k Vectors", "DONE (Trained)"],
        ["3", "Landslide Inventory", "SYNTHETIC", "Sample Generator (gsi_inventory_loader.py)", "GSI Bhukosh / NRSC Landslide Atlas", "DONE (Schema)"],
        ["4", "Rainfall Telemetry (Nowcast)", "SIMULATED SCHEMA", "IMD Connector (ingestion/imd_fetcher.py)", "IMD AWS Pune REST API (Mausam)", "PENDING API KEY"],
        ["5", "24-48h Weather Forecast", "ALGORITHMIC", "Geotechnical Index (forecast_model.py)", "IMD GFS 0.125 / NCMRWF Unified Model", "DONE (Forward)"],
        ["6", "2-6h Surge Nowcast", "NEURAL ARCH", "2-Layer PyTorch LSTM (lstm_nowcast.py)", "IMD Doppler Radar + In-situ sensors", "AWAITING DATA"],
        ["7", "Digital Elevation Model", "ALGO + SYNTH", "Horn DEM Engine (dem_processor.py)", "Copernicus DEM GLO-30 / CartoDEM", "PROCESSOR READY"],
        ["8", "InSAR Ground Creep", "SIMULATED SCHEMA", "GEE Connector (gee_sentinel_fetcher.py)", "Sentinel-1 SAR C-band IW SLC (ESA)", "PENDING GEE KEY"],
        ["9", "NDVI / Moisture Indices", "SIMULATED SCHEMA", "Multispectral Pipeline (gee_sentinel_fetcher.py)","Sentinel-2 Optical 10m Bands", "PENDING GEE KEY"],
        ["10", "Soil Moisture Saturation", "CALIBRATED SIM", "Soil Moisture Loader (soil_moisture_loader.py)", "NASA SMAP L3 / In-situ TDR Probes", "SIMULATED"],
        ["11", "In-Situ Geotechnical IoT", "SIMULATED HOOKS", "Threshold Hooks (lstm_nowcast.py)", "SDMA / IIT-R Ground Slope Sensor Mesh", "MOCK (Hardware)"],
        ["12", "Highway Corridor Graph", "REAL GRAPH", "NetworkX Graph (road_network_graph.py)", "MoRTH / BRO Project Beacon & Swastik", "DONE (Live)"],
        ["13", "Citizen Photo Reports", "REAL", "HTML5 Camera + Geolocation (ReportHazardModal)", "Citizen Smartphone Crowdsourcing", "DONE (Live)"],
        ["14", "Citizen Video Reports", "REAL", "HTML5 Media Capture API (ReportHazardModal)", "Citizen Smartphone Edge Crowdsourcing", "DONE (Live)"],
        ["15", "Offline Queue Protocol", "REAL", "IndexedDB + W3C Service Worker (offlineDb.ts)", "Local Client Device Storage", "DONE (Live)"],
        ["16", "Officer Ground Feedback", "REAL", "Feedback Modal + Retrain Pipeline (retrain_pipeline)", "DDMA / PWD Field Engineers", "DONE (Live)"],
        ["17", "Evacuation Audio Siren", "REAL", "Web Audio API AudioContext Synthesizer", "Local Device Speaker Hardware", "DONE (Live)"],
        ["18", "Spoken Voice Alert (TTS)", "REAL", "W3C Web Speech API (AlertBanner.tsx)", "Browser Localized Speech Synthesis", "DONE (Live)"]
    ]
    # Landscape page width is 297mm minus margins = 267mm
    pdf.draw_table(headers, rows, [8, 48, 38, 72, 65, 36])

    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 4, "Key Jury Defense Statement:", ln=True)
    pdf.set_font("Helvetica", "", 7.5)
    pdf.set_text_color(51, 65, 85)
    pdf.multi_cell(0, 3.8, "All ingestion modules in ml-engine/ingestion/ already conform to exact official API response schemas (IMD AWS, Copernicus Sentinel, GSI Bhukosh). Production activation requires only inserting API credentials into the .env file without changing any model inference logic.")

    out_path = os.path.join(DOCS_DIR, "SIH26001_Dataset_Status_Matrix.pdf")
    pdf.output(out_path)
    shutil.copy(out_path, os.path.join(PUBLIC_DOCS_DIR, "SIH26001_Dataset_Status_Matrix.pdf"))
    print(f"Generated {out_path}")

if __name__ == "__main__":
    build_tech_stack_pdf()
    build_model_cards_pdf()
    build_dataset_status_pdf()
    print("All PDFs successfully built and copied to public/docs/")
