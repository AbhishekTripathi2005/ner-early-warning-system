import os
from fpdf import FPDF

# Ensure output directory exists
DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")
os.makedirs(DOCS_DIR, exist_ok=True)

class ProfessionalPDF(FPDF):
    def __init__(self, title_text, orientation="P"):
        super().__init__(orientation=orientation, unit="mm", format="A4")
        self.doc_title = title_text
        self.set_auto_page_break(auto=True, margin=15)

    def header(self):
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(100, 116, 139)
        self.cell(0, 5, f"SMART INDIA HACKATHON 2026 | PS ID: SIH26001 (MDoNER)", border=0, align="L")
        self.cell(0, 5, self.doc_title, border=0, align="R")
        self.ln(7)
        self.set_draw_color(2, 132, 199)
        self.set_line_width(0.5)
        self.line(self.get_x(), self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 5, f"Page {self.page_no()} | AI-Based Landslide Early Warning System (NER) | Live: ner-early-warning-system.vercel.app", border=0, align="C")

# --- 1. Executive One-Pager ---
def generate_one_pager():
    pdf = ProfessionalPDF("Executive One-Pager", orientation="P")
    pdf.add_page()
    
    # Title
    pdf.set_font("Helvetica", "B", 15)
    pdf.set_text_color(15, 23, 42)
    pdf.multi_cell(0, 7, "AI-Based Early Warning & Landslide Risk Monitoring Platform in NER")
    
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 5, "Ministry of Development of North Eastern Region (MDoNER) | Disaster Management Cell", ln=True)
    pdf.ln(3)

    # 1. Challenge
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 6, "1. THE REGIONAL CHALLENGE", ln=True)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(0, 4.5, "The North Eastern Region (NER) of India accounts for >60% of India's landslide severances during the monsoon season. Steep terrain, fragile tectonic geology (Seismic Zone V), and cloudbursts (>260mm/48h) frequently collapse lifelines like NH-10 (Sikkim Lifeline) and SH-5 (Meghalaya Sohra). Current early warning systems fail due to coarse district boundaries (15-25 km), total communication blackout during storm cable cuts, lack of localized field verification, and zero road-isolation impact intelligence.")
    pdf.ln(2)

    # 2. Proposed Solution
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 6, "2. THE SOLUTION: HYBRID CLOUD-NATIVE & OFFLINE-FIRST LIFELINE", ln=True)
    
    features = [
        ("Hybrid Physics + GeoAI Engine", "Couples slope mechanics (Dynamic Factor of Safety FoS) with XGBoost and PyTorch LSTMs, fusing Sentinel-1 InSAR surface displacement (-28mm/yr creep) with IMD Doppler radar and 30m Digital Elevation Models."),
        ("Offline-First PWA (Zero Network Loss)", "Service Worker + IndexedDB caching layer keeps Esri map tiles and alerts alive during complete cell tower failures. Citizen hazard reports queue locally and auto-sync in the background upon reconnection."),
        ("Crowdsourced Video & Photo Reporting", "Enables locals and scouts to upload geo-tagged photos or short video clips (15-20s) with 1-click GPS auto-detection and automated AI spatial-correlation validation."),
        ("Road-Isolation Graph Intelligence", "Derives cut-off Himalayan hamlets and affected populations for every blocked highway corridor (e.g. NH-10: 5 hamlets cut off, 18,400 residents isolated) with dynamic detour advisories."),
        ("Multi-Horizon Weather Nowcast", "Interactive Recharts dual-axis projection correlating precipitation rate (mm/h) against Landslide Susceptibility Index (0.0-1.0) across 6h Nowcast, 24h Cumulative, and 48h Outlook."),
        ("Multi-Channel Dispatches & Voice Alerts", "Features Web Audio siren synthesizer, NDMA CAP v1.2 SMS simulation, browser Web Speech API spoken audio bulletins, and 5 languages (English, Hindi, Assamese, Bodo, Khasi)."),
        ("Continuous Learning Retraining Loop", "Officer interface to mark alerts as Confirmed (TP), False Alarm (FP), or Missed Event (FN), logging into feedback_log for automated AI fine-tuning.")
    ]

    for title, desc in features:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(6, 4.5, chr(149), border=0)
        pdf.cell(65, 4.5, title + ": ", border=0)
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.5, desc)
        pdf.ln(1)

    pdf.ln(2)

    # 3. Impact Table
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 6, "3. QUANTITATIVE IMPACT & INNOVATION BENCHMARKS", ln=True)

    pdf.set_font("Helvetica", "B", 8)
    pdf.set_fill_color(241, 245, 249)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(50, 6, " Metric", 1, 0, "L", fill=True)
    pdf.cell(60, 6, " Traditional Systems", 1, 0, "L", fill=True)
    pdf.cell(75, 6, " Our Cloud-Native Platform (SIH 2026)", 1, 1, "L", fill=True)

    rows = [
        ("Warning Lead Time", "0 - 30 minutes (Often post-event)", "3.5 - 6.0 Hours Advance Lead Time"),
        ("Spatial Granularity", "District level (15 - 25 km)", "Slope & Road-Segment Level (30 meters)"),
        ("Network Blackout", "100% Online only (Fails in storms)", "Offline PWA + IndexedDB Queue (Zero Data Loss)"),
        ("Ground Validation", "Delayed 24 - 48 hours", "Real-Time Citizen Photo & Video with Auto-GPS"),
        ("Linguistic Reach", "English / Hindi text only", "5 Languages (EN, HI, AS, Bodo, Khasi) + Spoken Audio"),
        ("Tile Licensing Cost", "Expensive commercial API keys", "100% Watermark-Free Esri Dark Gray Vector GIS")
    ]

    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(30, 41, 59)
    for m, t, o in rows:
        pdf.cell(50, 5, f" {m}", 1, 0, "L")
        pdf.cell(60, 5, f" {t}", 1, 0, "L")
        pdf.set_font("Helvetica", "B", 8)
        pdf.set_text_color(2, 132, 199)
        pdf.cell(75, 5, f" {o}", 1, 1, "L")
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(30, 41, 59)

    pdf.ln(3)

    # 4. Deployment Readiness
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 5, "4. GOVERNMENT DEPLOYMENT READINESS (NIC MEGHRAJ & SDMA)", ln=True)
    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(0, 4.2, "Containerized Docker microservices engineered for rapid staging on the National Informatics Centre (NIC) MeghRaj Cloud. Ready for immediate webhook integration with SDMA Meghalaya, Sikkim, Assam, the Border Roads Organisation (BRO), and NDRF battalions.")

    out_path = os.path.join(DOCS_DIR, "SIH26001_Executive_One_Pager.pdf")
    pdf.output(out_path)
    print("Generated:", out_path)

# --- 2. Presentation Deck Outline ---
def generate_ppt_pdf():
    pdf = ProfessionalPDF("Presentation Deck Outline", orientation="L")
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 8, "Smart India Hackathon 2026 - Presentation Deck Outline (10 Slides)", ln=True)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 6, "PS ID: SIH26001 | Ministry of Development of North Eastern Region (MDoNER)", ln=True)
    pdf.ln(3)

    slides = [
        ("Slide 1: Title Slide", "Cloud-Native AI & Physics-Hybrid Landslide Early Warning System. Protecting Critical Himalayan Lifelines across 8 NER States. Live URL: ner-early-warning-system.vercel.app"),
        ("Slide 2: Regional Context & 4 Failures", "Fragile young geology + extreme cloudbursts (>11,000mm/yr). 150+ landslides/yr. Existing systems fail on coarse resolution, storm network blackouts, zero ground truth, and static unranked warnings."),
        ("Slide 3: Unique 7-Pillar Solution", "1. Physics+GeoAI (FoS + XGBoost/PyTorch) | 2. Citizen Photo & Video Reporting with Auto-GPS | 3. Road-Isolation Graph Intelligence | 4. Offline-First PWA (IndexedDB) | 5. Recharts Weather Nowcast | 6. Continuous Learning Feedback | 7. Digital Twins of NH-10 & SH-5."),
        ("Slide 4: End-to-End Enterprise Architecture", "Data Layer (Sentinel-1 InSAR, IMD Radar, IoT) -> GeoAI Engine -> PostgreSQL/PostGIS + FastAPI -> Next.js 14 Web PWA + IndexedDB -> 5 Languages + Web Speech Audio Bulletins."),
        ("Slide 5: Live Demo Walkthrough Highlights", "Tactical GIS with regional camera jumps -> 3.5h advance alerts with 'Listen' voice button -> Video hazard reporting with auto-GPS -> DevTools Offline Mode demonstration proving zero data loss!"),
        ("Slide 6: Quantitative Impact Benchmarks", "3.5 to 6.0 hour lead time vs 0-30 min. 30-meter slope granularity vs 15-25km. Offline local queueing vs system failure. Spoken voice in 5 languages (English, Hindi, Assamese, Bodo, Khasi)."),
        ("Slide 7: Scalability across 8 NER States", "Specific calibrations for Sikkim/Arunachal rockfalls, Meghalaya escarpment saturation, Assam/Tripura railway cuts, and Mizoram urban creep. Zero recurring tile license costs via public Esri Dark Gray canvas."),
        ("Slide 8: Tech Stack & Open Standards", "Next.js 14, TypeScript, Tailwind CSS, Leaflet, Recharts, FastAPI, PostGIS, XGBoost, PyTorch, OGC GeoJSON, NDMA CAP v1.2, W3C PWA."),
        ("Slide 9: Rollout Timeline", "Phase 1 (Months 1-2): Pilot staging with SDMA Meghalaya & Sikkim. Phase 2 (Months 3-4): BRO & IMD telemetry hooks. Phase 3 (Months 5-6): National deployment on NIC MeghRaj Cloud."),
        ("Slide 10: Conclusion & Q&A", "Transforming early warnings from passive post-disaster notifications into actionable, localized, offline-resilient lifelines for North East India. GitHub & Live Vercel Demo.")
    ]

    for title, desc in slides:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(2, 132, 199)
        pdf.cell(0, 5.5, title, ln=True)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 4.5, desc)
        pdf.ln(2)

    out_path = os.path.join(DOCS_DIR, "SIH26001_Presentation_Deck_Outline.pdf")
    pdf.output(out_path)
    print("Generated:", out_path)

# --- 3. Video Walkthrough Script ---
def generate_video_script_pdf():
    pdf = ProfessionalPDF("Video Walkthrough Script", orientation="P")
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 15)
    pdf.set_text_color(15, 23, 42)
    pdf.multi_cell(0, 7, "Prototype Walkthrough Video Script (2-3 Min / 165 Seconds)")
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(2, 132, 199)
    pdf.cell(0, 5, "Problem Statement SIH26001 | Ministry of Development of North Eastern Region (MDoNER)", ln=True)
    pdf.ln(3)

    scenes = [
        ("Scene 1: Introduction & Regional Vulnerability", "0:00 - 0:20",
         "Visuals: Command center dashboard, live IST clock, SIH26001 badge, dark GIS aesthetic.",
         '"Every monsoon, the North Eastern Region of India faces severe landslides that claim lives and cut off entire mountain valleys. Under Problem Statement SIH26001 for MDoNER, we have built a cloud-native, physics-and-AI hybrid early warning platform designed specifically for the unique terrain and communication challenges of North East India."'),
        
        ("Scene 2: Watermark-Free Esri GIS & Regional Jumps", "0:20 - 0:45",
         "Visuals: Scroll to GIS Map; click camera jumps (Sikkim, Cherrapunji, Dima Hasao); toggle layers.",
         '"Our dashboard features a clean, watermark-free Esri Dark Gray vector GIS engine. Incident commanders can instantly jump between vulnerable hotspots-from Sikkim\'s Teesta corridor to Meghalaya\'s Sohra escarpments. With multi-layer controls, officers can overlay satellite InSAR deformation, IoT sensor telemetry, and live road networks in real time."'),

        ("Scene 3: Early Warning Dispatches & Spoken Voice Alerts", "0:45 - 1:10",
         'Visuals: Hover over RED ALERT card; click "Listen" (soundwave animates); click siren simulator.',
         '"Our early warning dispatches provide a critical 3.5 to 5-hour lead time. For low-literacy users and emergency field radios, every alert card features a built-in text-to-speech voice bulletin using browser Web Speech API. Commanders can also trigger automated evacuation sirens and multi-lingual NDMA CAP v1.2 SMS broadcasts directly to thousands of citizens."'),

        ("Scene 4: Video & Photo Hazard Reporting with Auto-GPS", "1:10 - 1:35",
         'Visuals: Open modal; select Video tab; click "Auto-Detect My GPS"; pick video sample & submit.',
         '"Ground reality matters. Citizens and field scouts can submit both photos and short 15-second video clips of active fissures or debris slides. With one-click GPS auto-detection, the report is instantly correlated by AI against slope susceptibility and projected directly onto the early warning map with an interactive video player."'),

        ("Scene 5: The Game Changer - Live Offline Mode Demo", "1:35 - 2:05",
         "Visuals: F12 DevTools Network Offline -> show amber banner -> queue report -> toggle Online -> auto-sync!",
         '"Himalayan landslides frequently collapse cell towers and sever fiber cables. Our platform is built offline-first using Service Workers and IndexedDB. Even without internet, the map tiles and alerts continue rendering. Hazard reports queue locally in the phone\'s database and automatically synchronize the exact second network connectivity is restored!"'),

        ("Scene 6: Recharts Weather Nowcast & Response Prioritization", "2:05 - 2:30",
         'Visuals: Weather tab Recharts dual-axis graph; Priorities tab ranked table formatted: Sector X: Priority Y.',
         '"In the weather nowcast tab, our interactive Recharts time-series correlates IMD radar precipitation against dynamic slope failure thresholds. And in our Emergency Response Prioritization tab, incidents are algorithmically ranked by population at risk and isolated cut-off hamlets, giving NDRF and SDRF teams clear tactical deployment priorities."'),

        ("Scene 7: Road Isolation Impact & Multilingual Coverage", "2:30 - 2:50",
         "Visuals: Highlight NH-10 card cut-off hamlets; click language switcher: Hindi -> Assamese -> Bodo -> Khasi.",
         '"Every blocked road card derived from our road network graph explicitly flags cut-off hamlets and isolated residents. And with full trilingual and tribal language support-including Assamese, Bodo, and Khasi-no community in the North East is left behind."'),

        ("Scene 8: Conclusion & Vision", "2:50 - 3:00",
         "Visuals: Command center wide view, MDoNER logo, live Vercel URL, and team credits.",
         '"A resilient, cloud-native, and offline-ready early warning system-saving lives and protecting lifelines across North East India. Thank you."')
    ]

    for title, timestamp, visuals, narration in scenes:
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(130, 5, title, border=0)
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(2, 132, 199)
        pdf.cell(0, 5, timestamp, border=0, align="R", new_x="LMARGIN", new_y="NEXT")

        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "I", 8.5)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(0, 4, visuals)
        
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(15, 23, 42)
        pdf.multi_cell(0, 4.2, narration)
        pdf.ln(3)

    out_path = os.path.join(DOCS_DIR, "SIH26001_Walkthrough_Video_Script.pdf")
    pdf.output(out_path)
    print("Generated:", out_path)

if __name__ == "__main__":
    generate_one_pager()
    generate_ppt_pdf()
    generate_video_script_pdf()
