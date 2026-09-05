# 🎬 2-3 Minute Prototype Walkthrough Video Script Outline
## Project: Cloud-Native Landslide Early Warning & Risk Monitoring Platform for NER
### Problem ID: SIH26001 | Ministry of Development of North Eastern Region (MDoNER)
**Target Video Duration**: 2 Minutes 45 Seconds (165 Seconds)

---

## ⏱️ Video Breakdown & Storyboard

### SCENE 1: Introduction & The North-East Reality (0:00 - 0:20)
- **Screen Visuals**:
  - Full-screen view of the dashboard header with title: *"NER Landslide Early Warning & Risk Monitoring System"*.
  - Camera pans over the high-contrast live IST clock, AI status indicator, and SIH26001 badge.
- **Voiceover (Narration)**:
  > *"Every monsoon, the North Eastern Region of India faces severe landslides that claim lives and cut off entire mountain valleys. Under Problem Statement SIH26001 for MDoNER, we have built a cloud-native, physics-and-AI hybrid early warning platform designed specifically for the unique terrain and communication challenges of North East India."*

---

### SCENE 2: Watermark-Free Esri GIS & Multi-Layer Zonation (0:20 - 0:45)
- **Screen Visuals**:
  - Scroll smoothly to the interactive GIS map section (`#gis-map-section`).
  - Click on the quick camera jump buttons: **[Sikkim NH-10]** $\rightarrow$ **[Cherrapunji Escarpment]** $\rightarrow$ **[Dima Hasao]**.
  - Toggle layer checkboxes: *Susceptibility Polygons*, *Point Heatmap*, *Road Corridors*, and *IoT Hill Sensors*.
- **Voiceover (Narration)**:
  > *"Our dashboard features a clean, watermark-free Esri Dark Gray vector GIS engine. Incident commanders can instantly jump between vulnerable hotspots—from Sikkim's Teesta corridor to Meghalaya's Sohra escarpments. With multi-layer controls, officers can overlay satellite InSAR deformation, IoT sensor telemetry, and live road networks in real time."*

---

### SCENE 3: Early Warning Dispatches & Voice Alert (Text-to-Speech) (0:45 - 1:10)
- **Screen Visuals**:
  - Hover over the glowing RED ALERT card in the top dispatch banner.
  - Click the **"🔊 Listen"** button. The soundwave animation bounces as the browser speaks the emergency bulletin.
  - Click the **"Simulate Evacuation Siren Broadcast"** button to open the siren modal, displaying the smartphone emergency mock-up and NDMA CAP v1.2 telemetry.
- **Voiceover (Narration)**:
  > *"Our early warning dispatches provide a critical 3.5 to 5-hour lead time. For low-literacy users and emergency field radios, every alert card features a built-in text-to-speech voice bulletin using browser Web Speech API. Commanders can also trigger automated evacuation sirens and multi-lingual NDMA CAP v1.2 SMS broadcasts directly to thousands of citizens."*

---

### SCENE 4: Video & Photo Hazard Reporting with Auto-GPS (1:10 - 1:35)
- **Screen Visuals**:
  - Click the pulsing red **"Report Hazard (Photo/Video)"** button.
  - Switch the media selector tab from *Photo* to *Video (15-20s)*.
  - Click **"📍 Auto-Detect My GPS"** to show instant latitude and longitude population.
  - Click the preset sample *"Active Debris Clip (12s Video)"* $\rightarrow$ click **"Submit Ground Report to Map"**.
  - The map smoothly flies to the coordinates, placing an animated spotlight pin (`📍`) that opens an inline video player popup!
- **Voiceover (Narration)**:
  > *"Ground reality matters. Citizens and field scouts can submit both photos and short 15-second video clips of active fissures or debris slides. With one-click GPS auto-detection, the report is instantly correlated by AI against slope susceptibility and projected directly onto the early warning map with an interactive video player."*

---

### SCENE 5: The Game Changer — Live Offline Mode Demo (1:35 - 2:05)
- **Screen Visuals**:
  - Open Chrome DevTools (`F12`), go to Network tab, and toggle from *No Throttling* to **`Offline`**.
  - Show the top header immediately displaying the amber banner:  
    `⚡ OFFLINE FIELD MODE ACTIVE: Operating from cached Esri GIS tiles & local telemetry. Queued Reports: 0`.
  - Submit another hazard report $\rightarrow$ show the modal notify: *"Stored in Offline Queue"*. The banner counter increments to `Queued Reports: 1`.
  - Toggle Network back to **`No Throttling` (Online)**.
  - Watch the green auto-sync confirmation pill appear: *"Reconnected & Auto-Synced: Successfully uploaded 1 offline citizen hazard report!"*
- **Voiceover (Narration)**:
  > *"Himalayan landslides frequently collapse cell towers and sever fiber cables. Our platform is built offline-first using Service Workers and IndexedDB. Even without internet, the map tiles and alerts continue rendering. Hazard reports queue locally in the phone's database and automatically synchronize the exact second network connectivity is restored!"*

---

### SCENE 6: Recharts Weather Nowcast & Response Prioritization (2:05 - 2:30)
- **Screen Visuals**:
  - Click on the **[Weather Forecast]** tab $\rightarrow$ hover over the interactive Recharts dual-axis chart showing rainfall rate bars and the red risk score curve.
  - Click on the **[Priorities]** tab $\rightarrow$ show the ranked incident table with format:  
    `Sector 1: Priority 1 — 4 villages isolated, 14,200 population affected`.
  - Click sort buttons: *Villages Cut Off* and *Population at Risk*.
- **Voiceover (Narration)**:
  > *"In the weather nowcast tab, our interactive Recharts time-series correlates IMD radar precipitation against dynamic slope failure thresholds. And in our Emergency Response Prioritization tab, incidents are algorithmically ranked by population at risk and isolated cut-off hamlets, giving NDRF and SDRF teams clear tactical deployment priorities."*

---

### SCENE 7: Road Isolation Impact & Multilingual Coverage (2:30 - 2:50)
- **Screen Visuals**:
  - Click **[Road Status]** tab $\rightarrow$ highlight the NH-10 card: *"5 Himalayan Hamlets Cut Off • 18,400 Residents"*.
  - Go to top header and click language buttons: **[हिन्दी]** $\rightarrow$ **[অসমীয়া]** $\rightarrow$ **[बर']** $\rightarrow$ **[Khasi]**, showing complete seamless UI translation.
- **Voiceover (Narration)**:
  > *"Every blocked road card derived from our road network graph explicitly flags cut-off hamlets and isolated residents. And with full trilingual and tribal language support—including Assamese, Bodo, and Khasi—no community in the North East is left behind."*

---

### SCENE 8: Conclusion & Vision (2:50 - 3:00)
- **Screen Visuals**:
  - Pull back to the full command center view showing live stats, map, and dispatches.
  - Display team credits, MDoNER logo, and live Vercel URL.
- **Voiceover (Narration)**:
  > *"A resilient, cloud-native, and offline-ready early warning system—saving lives and protecting lifelines across North East India. Thank you."*

---

## 💡 Pro Recording Tips
1. **Screen Resolution**: Record in 1920x1080 (1080p 60fps) for crisp font rendering.
2. **Audio**: Use a quiet room and clean microphone for voiceover; keep background music at low volume (10-15%).
3. **Cursor Movement**: Move the mouse deliberately; pause for 1 second on key buttons before clicking.
4. **Offline Demo Highlight**: The DevTools offline demo (Scene 5) is your **strongest differentiator**—make sure the transition from amber banner to green sync toast is clearly visible!
