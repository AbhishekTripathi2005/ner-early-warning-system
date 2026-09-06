import os
import shutil
from fpdf import FPDF
from fpdf.enums import XPos, YPos

DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")
PUBLIC_DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "docs")
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(PUBLIC_DOCS_DIR, exist_ok=True)

class EvaluationPDF(FPDF):
    def __init__(self, doc_title="SIH 2026 EVALUATION CRITERIA"):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.doc_title = doc_title
        self.set_auto_page_break(auto=True, margin=12)

    def header(self):
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(100, 116, 139)
        self.cell(100, 5, "SMART INDIA HACKATHON 2026 | PROBLEM ID: SIH26001 (MDoNER)", align="L")
        self.cell(0, 5, "CORE EVALUATION RUBRIC", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(2, 132, 199)
        self.set_line_width(0.5)
        self.line(self.get_x(), self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(3)

    def footer(self):
        self.set_y(-10)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 5, f"Page {self.page_no()} | AI-Based Landslide Early Warning System (NER) | Live PWA: ner-early-warning-system.vercel.app", align="C")

    def section_heading(self, number_str, title_str):
        self.set_font("Helvetica", "B", 10.5)
        self.set_text_color(2, 132, 199)
        self.cell(0, 5.5, f"{number_str}. {title_str.upper()}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def sub_heading(self, text):
        self.set_font("Helvetica", "B", 8.5)
        self.set_text_color(15, 23, 42)
        self.cell(0, 4.5, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(0.5)

    def body_text(self, text):
        self.set_font("Helvetica", "", 7.8)
        self.set_text_color(51, 65, 85)
        self.multi_cell(0, 3.8, text)
        self.ln(1.5)

    def draw_table(self, headers, rows, col_widths):
        self.set_font("Helvetica", "B", 7.5)
        self.set_fill_color(241, 245, 249)
        self.set_text_color(15, 23, 42)
        self.set_draw_color(203, 213, 225)
        
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 5.5, h, border=1, fill=True, align="L")
        self.ln()
        
        self.set_font("Helvetica", "", 7.0)
        self.set_text_color(51, 65, 85)
        for r_idx, row in enumerate(rows):
            fill = (r_idx % 2 == 1)
            self.set_fill_color(248, 250, 252) if fill else self.set_fill_color(255, 255, 255)
            for i, cell in enumerate(row):
                self.cell(col_widths[i], 4.8, str(cell)[:58], border=1, fill=fill, align="L")
            self.ln()
        self.ln(2)

def generate_evaluation_criteria_pdf():
    pdf = EvaluationPDF()
    
    # ---------------- PAGE 1 ----------------
    pdf.add_page()
    
    # Main Header
    pdf.set_font("Helvetica", "B", 13.5)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6.5, "AI-Based Landslide Early Warning & Risk Monitoring System in NER", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 4.5, "Ministry of Development of North Eastern Region (MDoNER) | Problem ID: SIH26001", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("Helvetica", "I", 7.8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 4, "Comprehensive Hackathon Defense Rubric: Novelty, Complexity, Feasibility, Sustainability, Usability", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    # 1. NOVELTY
    pdf.section_heading("1", "NOVELTY & COMPETITIVE UNIQUENESS")
    pdf.body_text(
        "Existing systems (GSI Bhukosh, NDMA SACHET, IMD Mausam) provide static 2D macro-polygons or district-wide rainfall thresholds (>100mm = Alert), resulting in false alarms across flat valleys and zero corridor-level actionability. Our platform introduces four unprecedented innovations:"
    )
    
    headers = ["Feature Dimension", "Existing Government Systems (GSI / IMD)", "Our SIH26001 Innovation"]
    rows = [
        ["Spatial Zonation", "Static 2D macro-polygons (1:50k) with no dynamic update", "Dynamic GeoAI fusing geology + live rainfall/soil saturation"],
        ["Alert Granularity", "Coarse district-wide alerts (15-25 km radius) -> False Alarms", "Hyper-local corridor & slope cutting precision (NH-10, NH-6)"],
        ["Trigger Mechanics", "Single rainfall threshold; ignores prior soil moisture & slope", "Mohr-Coulomb physics + XGBoost (pore pressure & toe cut)"],
        ["Storm Connectivity", "Cloud-dependent; crashes when fiber lines & cell towers drop", "Offline-first PWA (Service Worker + IndexedDB queue)"],
        ["Data Flow", "Top-down one-way broadcast; zero ground-truth feedback", "Bi-directional: Citizen photo/video reports + Officer verify"],
        ["Explainability", "Black-box score; administrators do not know root cause", "TreeSHAP feature attribution in plain Hindi & English"]
    ]
    pdf.draw_table(headers, rows, [32, 78, 80])

    # 2. COMPLEXITY + CLARITY
    pdf.section_heading("2", "COMPLEXITY + CLARITY")
    pdf.sub_heading("Deep Multi-Horizon Intelligence & Graph Propagation Under the Hood:")
    pdf.body_text(
        "- Multi-Horizon Temporal Modeling: 2-Layer PyTorch LSTM (LandslideLSTM) in ml-engine/nowcast/lstm_nowcast.py captures rapid moisture saturation velocity under sudden cloudburst surges. Medium-term (24-48h) deterministic hydro-load index powers dual-axis Recharts curves.\n"
        "- Arterial Highway Graph Intelligence (NetworkX): Rather than merely predicting slope failure, the system evaluates secondary network isolation across 13 transit nodes and 11 arterial road links (NH-10 Sevoke-Gangtok, NH-6 Shillong-Silchar, SH-5, NH-29) using Dijkstra reachability (nx.has_path) to detect cut-off communities and compute detour alternatives in <50ms.\n"
        "- Resilient Offline State Engine: Multi-cache Service Worker (sw.js) precaching app shell & Esri dark gray raster tiles; transactional IndexedDB queue with auto-sync on window.online reconnect.\n"
        "- Native Browser Synthesis: Web Audio API (AudioContext) synthesizer modulates emergency evacuation siren warble directly in memory; Web Speech API delivers zero-bandwidth multilingual TTS bulletins."
    )
    pdf.sub_heading("Architectural Clarity & Separation of Concerns:")
    pdf.body_text(
        "Tier 1 (Presentation): Next.js 14 App Router, TypeScript, Tailwind CSS, Leaflet GIS | Tier 2 (Backend): FastAPI Async, PostgreSQL 15 + PostGIS 3.3 (EPSG:4326), Redis 7, Celery | Tier 3 (ML Engine): Autonomous microservice on Port 8001 (XGBoost 2.0, PyTorch 2.2, TreeSHAP)."
    )

    # ---------------- PAGE 2 ----------------
    pdf.add_page()

    # 3. FEASIBILITY
    pdf.section_heading("3", "FEASIBILITY & REAL-WORLD DEPLOYABILITY")
    pdf.body_text(
        "1. Zero-Cost Open Infrastructure: No paid proprietary Google Maps licenses; leverages zero-cost Esri World Dark Gray Canvas REST tiles (no watermark) with fallback to Survey of India (SOI) NHP web services. Open satellite/weather data mapped to IMD AWS, NASA GPM, Sentinel-1 SAR, and SRTM 30m DEM.\n"
        "2. Ultra-Low Bandwidth & 2G Operability: Optimized Next.js production build (~241 kB First Load JS). API endpoints exchange lightweight JSON (<5 KB). Fails over to 2G SMS / Cell Broadcast when internet is severed.\n"
        "3. Universal Citizen Device Compatibility: No 50MB app store APK required. Operates seamlessly inside mobile Chrome/Safari on budget Rs. 6,000 Android phones using HTML5 Camera & Geolocation APIs.\n"
        "4. Remote Space InSAR vs Expensive In-Situ Sensors: Physical piezometers cost lakhs and wash away during debris slides. The platform leverages space-borne Sentinel-1 InSAR surface creep velocity (mm/yr) to monitor slope deformation remotely, cutting CapEx by over 80%."
    )

    # 4. SUSTAINABILITY + SCALABILITY
    pdf.section_heading("4", "SUSTAINABILITY + SCALABILITY")
    pdf.body_text(
        "- Pan-NER & Himalayan Scalability: Standardized on PostGIS WGS84 (EPSG:4326), enabling immediate expansion from pilot corridors (Sikkim & Meghalaya) across all 8 NER states (Assam, Arunachal, Nagaland, Manipur, Mizoram, Tripura) and Western Himalayas (Uttarakhand, HP) with zero database schema refactoring.\n"
        "- Cloud-Native Elastic Auto-Scaling: Fully containerized via Docker Compose (infra/docker-compose.yml) with Kubernetes manifests (infra/k8s/) ready for NIC MeghRaj. Kubernetes Horizontal Pod Autoscaler (HPA) dynamically scales backend and ML pods from 1 to 10 instances during peak monsoon storms.\n"
        "- Continuous Self-Learning Loop (No Model Decay): Solves concept drift via ml-engine/feedback_loop/retrain_pipeline.py. Verified field officer ground-truth reports automatically append to dataset and trigger model refit.\n"
        "- Zero Recurring Software License Fees: 100% open-source Linux/Postgres/Python stack ensures zero recurring per-seat fees for state disaster management authorities."
    )

    # 5. USABILITY + SCOPE
    pdf.section_heading("5", "USABILITY + SCOPE")
    pdf.body_text(
        "- District Collectors & DDMA: Unified bird's eye GIS command center, affected population estimates, road cutoffs, and prioritized evacuation dispatch lists.\n"
        "- SDRF/NDRF & PWD/BRO Responders: Live road isolation alerts, alternate detour routes for heavy earth-movers, and field verification modal for ground-truth reporting.\n"
        "- Local Tribal Villagers: Multilingual interface (Hindi, English, Assamese, Bodo, Khasi), spoken voice bulletins (TTS), and acoustic siren warbles without requiring literacy.\n"
        "- Highway Commuters & Truckers: Real-time arterial corridor transit safety status along NH-10 and NH-6."
    )

    # 60-Second Winning Pitch Box
    pdf.ln(1)
    pdf.set_fill_color(238, 242, 255)
    pdf.set_draw_color(99, 102, 241)
    pdf.set_line_width(0.4)
    pdf.rect(pdf.get_x(), pdf.get_y(), 190, 24, style="FD")
    
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(67, 56, 202)
    pdf.cell(0, 4.5, "  WINNING JURY DEFENSE PITCH (60-SECOND SUMMARY):", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    
    pdf.set_font("Helvetica", "", 7.5)
    pdf.set_text_color(30, 41, 59)
    pitch_text = (
        "  'Traditional systems are static maps or simple rain trackers that crash when the storm snaps fiber cables. Our platform introduces\n"
        "  four unprecedented pillars: 1. Physics+GeoAI fusion (XGBoost + Mohr-Coulomb) reducing false alarms by >30%; 2. Arterial highway\n"
        "  graph intelligence that predicts road isolation and detour routes; 3. Offline-first PWA resilience that continues functioning with 0 KB internet;\n"
        "  and 4. Closed-loop citizen-sensor and officer verification that continuously retrains our models. 100% open-source & NIC MeghRaj ready.'"
    )
    pdf.multi_cell(186, 3.6, pitch_text)

    # Output file
    out_path = os.path.join(DOCS_DIR, "SIH26001_Evaluation_Criteria_Defense_Guide.pdf")
    pdf.output(out_path)
    shutil.copy(out_path, os.path.join(PUBLIC_DOCS_DIR, "SIH26001_Evaluation_Criteria_Defense_Guide.pdf"))
    print(f"Generated {out_path}")

if __name__ == "__main__":
    generate_evaluation_criteria_pdf()
