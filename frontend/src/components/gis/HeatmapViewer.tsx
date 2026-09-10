"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Info,
  Route,
  Shield,
  Navigation,
  Camera,
  Check,
  X,
  Mountain,
  CloudRain,
  Droplets,
  Activity,
  Maximize2,
  Map as MapIcon
} from "lucide-react";
import { Language, translations } from "../../lib/i18n";
import { CitizenReportData } from "../reporting/CitizenReportModal";
import { EvacuationSirenModal } from "../alerts/EvacuationSirenModal";

interface HeatmapViewerProps {
  lang: Language;
  onSelectFeature?: (feature: any) => void;
  citizenReports?: CitizenReportData[];
  onVerifyReport?: (reportId: number, status: "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM") => void;
  focusTarget?: { lat: number; lon: number; id: number; _ts?: number } | null;
}

interface AiContribution {
  name: string;
  pct: number;
  color: string;
  gradient: string;
}

export interface HotspotSector {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  slope: number;
  rain48: number;
  soil: number;
  intensity: number;
  tier: "SEVERE" | "HIGH" | "MODERATE" | "LOW";
  insar: number;
  suggestedAction: string;
  lastUpdated: string;
  exp_hi: string;
  exp_en: string;
  aiContributions: AiContribution[];
}

// 1. Point Heatmap Hotspots across 8 NER States
const nerHotspots: HotspotSector[] = [
  {
    id: "NER-ML-01",
    name: "Cherrapunji Escarpment",
    district: "East Khasi Hills",
    state: "Meghalaya",
    lat: 25.275,
    lon: 91.731,
    slope: 44.2,
    rain48: 260.4,
    soil: 94.0,
    intensity: 0.94,
    tier: "SEVERE",
    insar: -32.5,
    suggestedAction: "Pre-emptive evacuation along steep escarpment settlements; suspend vehicular transit on SH-5.",
    lastUpdated: "2 mins ago (Live IMD Sync)",
    exp_hi: "Pichle 48 ghanto ki bhaari baarish (260.4mm) + mitti mein 94% saturation + steep 44.2° dhalan ki wajah se risk SEVERE hai.",
    exp_en: "Severe risk driven by 260.4mm 48h rainfall + 94% saturated soil on steep 44.2° sandstone slope.",
    aiContributions: [
      { name: "Rainfall (Antecedent 48h)", pct: 42, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Slope Gradient (SRTM DEM)", pct: 28, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Soil Moisture Saturation", pct: 18, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 12, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-AS-01",
    name: "Diphu Hill Ridge (Km 18)",
    district: "Karbi Anglong",
    state: "Assam",
    lat: 25.842,
    lon: 93.435,
    slope: 41.5,
    rain48: 265.0,
    soil: 93.5,
    intensity: 0.96,
    tier: "SEVERE",
    insar: -34.8,
    suggestedAction: "Immediate road closure on Lumding-Diphu highway cut; mobilize SDRF heavy earthmovers.",
    lastUpdated: "4 mins ago (Live AWS Telemetry)",
    exp_hi: "Lumding-Diphu highway cutting par 265mm baarish aur 34.8mm/yr InSAR subsidence ki wajah se catastrophic failure alert.",
    exp_en: "Critical road cut failure alert driven by 265mm rain and 34.8mm/yr active InSAR subsidence along SH-19.",
    aiContributions: [
      { name: "Rainfall (Antecedent 48h)", pct: 44, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Slope Gradient (SRTM DEM)", pct: 26, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "InSAR Surface Creep", pct: 16, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" },
      { name: "Soil Moisture Saturation", pct: 14, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" }
    ]
  },
  {
    id: "NER-SK-01",
    name: "29th Mile (Sevoke-Teesta)",
    district: "East Sikkim / WB",
    state: "Sikkim",
    lat: 27.050,
    lon: 88.490,
    slope: 46.0,
    rain48: 195.0,
    soil: 91.0,
    intensity: 0.89,
    tier: "SEVERE",
    insar: -28.0,
    suggestedAction: "Divert all Sikkim transit via Panbu-Mungpoo detour; deploy NDRF spotters at river toe.",
    lastUpdated: "1 min ago (Real-time Doppler)",
    exp_hi: "Teesta nadi ke kataav aur InSAR creep ki wajah se NH-10 arterial highway par debris avalanche active hai.",
    exp_en: "Active debris avalanche blocking NH-10 corridor caused by river toe erosion and heavy 195mm rainfall.",
    aiContributions: [
      { name: "Slope Gradient (SRTM DEM)", pct: 36, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Rainfall (Antecedent 48h)", pct: 34, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Soil Moisture Saturation", pct: 16, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 14, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-SK-02",
    name: "Singtam-Dikchu Flank",
    district: "East Sikkim",
    state: "Sikkim",
    lat: 27.230,
    lon: 88.500,
    slope: 38.5,
    rain48: 145.0,
    soil: 86.5,
    intensity: 0.81,
    tier: "HIGH",
    insar: -14.2,
    suggestedAction: "Restrict NH-10 to controlled single-lane pilot convoys; halt night commercial travel.",
    lastUpdated: "6 mins ago (Automatic Station)",
    exp_hi: "InSAR surface creep (14.2mm/yr) aur 86.5% saturated soil se one-way police convoy chalai ja rahi hai.",
    exp_en: "Active InSAR surface creep (14.2mm/yr) + 86.5% soil saturation creates critical slope shear hazard along NH-10.",
    aiContributions: [
      { name: "Slope Gradient (SRTM DEM)", pct: 32, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Rainfall (Antecedent 48h)", pct: 30, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Soil Moisture Saturation", pct: 22, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 16, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-AS-02",
    name: "Haflong Railway Cutting",
    district: "Dima Hasao",
    state: "Assam",
    lat: 25.180,
    lon: 93.020,
    slope: 31.0,
    rain48: 110.0,
    soil: 76.0,
    intensity: 0.62,
    tier: "HIGH",
    insar: -9.5,
    suggestedAction: "Speed restriction of 20 km/h on NFR hill railway section; alert track inspection patrols.",
    lastUpdated: "8 mins ago (AWS Telemetry)",
    exp_hi: "Clay-shale strata mein 110mm baarish ke baad moderate creep darj hua hai.",
    exp_en: "Elevated risk on clay-shale strata due to 110mm antecedent rainfall and railway slope cutting.",
    aiContributions: [
      { name: "Rainfall (Antecedent 48h)", pct: 35, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Slope Gradient (SRTM DEM)", pct: 29, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Soil Moisture Saturation", pct: 24, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 12, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-NL-01",
    name: "Kohima-Pfutsero Escarpment",
    district: "Kohima",
    state: "Nagaland",
    lat: 25.670,
    lon: 94.100,
    slope: 35.0,
    rain48: 98.0,
    soil: 72.0,
    intensity: 0.58,
    tier: "HIGH",
    insar: -11.0,
    suggestedAction: "Advisory to Kohima district emergency cell; inspect retaining wall drainage weep-holes.",
    lastUpdated: "10 mins ago (Satellite Telemetry)",
    exp_hi: "Active thrust fault aur 98mm baarish ki wajah se highway slip hazard elevated hai.",
    exp_en: "Thrust fault zone activation with 98mm rain creating elevated highway slip warning.",
    aiContributions: [
      { name: "Slope Gradient (SRTM DEM)", pct: 34, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Rainfall (Antecedent 48h)", pct: 28, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Soil Moisture Saturation", pct: 25, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 13, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-MZ-01",
    name: "Champhai Ridge",
    district: "Champhai",
    state: "Mizoram",
    lat: 23.470,
    lon: 93.320,
    slope: 24.5,
    rain48: 42.0,
    soil: 48.0,
    intensity: 0.28,
    tier: "LOW",
    insar: -2.1,
    suggestedAction: "Normal situational vigilance; continue routine 6-hour automated geotechnical polling.",
    lastUpdated: "12 mins ago (Routine Polling)",
    exp_hi: "Nami aur dhalan surakshit sima ke andar hain. Normal advisory active hai.",
    exp_en: "Soil moisture and precipitation well within geotechnical safety margins.",
    aiContributions: [
      { name: "Soil Moisture Saturation", pct: 28, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "Slope Gradient (SRTM DEM)", pct: 26, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Rainfall (Antecedent 48h)", pct: 24, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "InSAR Surface Creep", pct: 22, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-AR-01",
    name: "Bhalukpong-Tenga Sector",
    district: "West Kameng",
    state: "Arunachal Pradesh",
    lat: 27.150,
    lon: 92.580,
    slope: 39.0,
    rain48: 135.0,
    soil: 82.0,
    intensity: 0.74,
    tier: "HIGH",
    insar: -16.4,
    suggestedAction: "BRO rockfall catch nets inspection; issue alert for military and civil convoys.",
    lastUpdated: "5 mins ago (IMD Radar)",
    exp_hi: "Border road cutting par heavy rain saturation ki wajah se rockfall alert jaari kiya gaya hai.",
    exp_en: "Border road cut section on high rainfall saturation prone to rockfall.",
    aiContributions: [
      { name: "Rainfall (Antecedent 48h)", pct: 38, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Slope Gradient (SRTM DEM)", pct: 32, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Soil Moisture Saturation", pct: 18, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 12, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  },
  {
    id: "NER-MN-01",
    name: "Noney Hill Corridor",
    district: "Noney",
    state: "Manipur",
    lat: 24.820,
    lon: 93.600,
    slope: 36.0,
    rain48: 125.0,
    soil: 79.0,
    intensity: 0.68,
    tier: "HIGH",
    insar: -15.0,
    suggestedAction: "Continuous acoustic emission monitoring around railway bridge abutments.",
    lastUpdated: "7 mins ago (InSAR Sync)",
    exp_hi: "Railway bridge construction zone ke paas soil creep monitor kiya ja raha hai.",
    exp_en: "Slope monitoring near railway infrastructure with 125mm antecedent rainfall.",
    aiContributions: [
      { name: "Slope Gradient (SRTM DEM)", pct: 35, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
      { name: "Rainfall (Antecedent 48h)", pct: 32, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
      { name: "Soil Moisture Saturation", pct: 21, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
      { name: "InSAR Surface Creep", pct: 12, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
    ]
  }
];

// 2. Hazard Micro-Zonation Polygons
const hazardPolygons = [
  {
    code: "ZONE-ML-01",
    name: "Cherrapunji-Shillong Vulnerability Zone",
    district: "East Khasi Hills, Meghalaya",
    color: "#ef4444",
    fillColor: "#ef4444",
    tier: "SEVERE",
    lsi: 0.94,
    coords: [
      [25.20, 91.65],
      [25.35, 91.65],
      [25.35, 91.85],
      [25.20, 91.85]
    ]
  },
  {
    code: "ZONE-AS-02",
    name: "Karbi Anglong (Diphu Cutting Zone)",
    district: "Karbi Anglong, Assam",
    color: "#ef4444",
    fillColor: "#ef4444",
    tier: "SEVERE",
    lsi: 0.96,
    coords: [
      [25.75, 93.35],
      [25.92, 93.35],
      [25.92, 93.55],
      [25.75, 93.55]
    ]
  },
  {
    code: "ZONE-SK-03",
    name: "Singtam-Gangtok Highway Basin",
    district: "East Sikkim",
    color: "#f97316",
    fillColor: "#f97316",
    tier: "HIGH",
    lsi: 0.81,
    coords: [
      [27.15, 88.42],
      [27.38, 88.42],
      [27.38, 88.68],
      [27.15, 88.68]
    ]
  },
  {
    code: "ZONE-AS-04",
    name: "Haflong Hill Cutting Enclosure",
    district: "Dima Hasao, Assam",
    color: "#f59e0b",
    fillColor: "#f59e0b",
    tier: "MODERATE",
    lsi: 0.62,
    coords: [
      [25.10, 92.95],
      [25.25, 92.95],
      [25.25, 93.15],
      [25.10, 93.15]
    ]
  },
  {
    code: "ZONE-MZ-05",
    name: "Champhai Ridge Valley",
    district: "Champhai, Mizoram",
    color: "#10b981",
    fillColor: "#10b981",
    tier: "LOW",
    lsi: 0.28,
    coords: [
      [23.35, 93.20],
      [23.55, 93.20],
      [23.55, 93.45],
      [23.35, 93.45]
    ]
  }
];

// 3. Arterial Highway Lifelines
const highwayCorridors = [
  {
    name: "NH-10 (Sikkim Lifeline - Blocked Section)",
    status: "BLOCKED",
    color: "#ef4444",
    weight: 5,
    dashArray: undefined,
    detour: "Divert via Panbu - Mungpoo - Jorethang link road (ETA 6h)",
    path: [
      [26.72, 88.43],
      [26.88, 88.47],
      [27.05, 88.49]
    ]
  },
  {
    name: "NH-10 Active Emergency Detour (Panbu Route)",
    status: "OPERATIONAL_DETOUR",
    color: "#06b6d4",
    weight: 3.5,
    dashArray: "6, 6",
    detour: "Designated one-way emergency corridor for essential supplies",
    path: [
      [26.88, 88.47],
      [26.98, 88.62],
      [27.10, 88.58],
      [27.23, 88.50]
    ]
  },
  {
    name: "SH-5 (Diphu - Lumding Corridor)",
    status: "HIGH_RISK_RESTRICTED",
    color: "#f59e0b",
    weight: 4,
    dashArray: undefined,
    detour: "Heavy commercial vehicles restricted past 18:00 hrs",
    path: [
      [25.84, 93.44],
      [25.75, 93.25],
      [25.70, 93.12]
    ]
  },
  {
    name: "NH-6 (Shillong - Silchar Lifeline)",
    status: "OPEN_MONITORED",
    color: "#10b981",
    weight: 3.5,
    dashArray: undefined,
    detour: "Normal flow with NDRF spotters at Sonapur tunnel",
    path: [
      [25.57, 91.88],
      [25.32, 92.20],
      [25.10, 92.50],
      [24.83, 92.79]
    ]
  },
  {
    name: "NH-29 (Dimapur - Kohima Highway)",
    status: "RESTRICTED",
    color: "#f97316",
    weight: 3.5,
    dashArray: undefined,
    detour: "One-way pilot car system active at Dzüdza bridge slide",
    path: [
      [25.90, 93.73],
      [25.75, 93.92],
      [25.67, 94.10]
    ]
  }
];

const generateMarkerPopupHtml = (pt: HotspotSector) => {
  const color =
    pt.intensity >= 0.75
      ? "#ef4444"
      : pt.intensity >= 0.55
      ? "#f97316"
      : pt.intensity >= 0.35
      ? "#f59e0b"
      : "#10b981";

  const tierBg =
    pt.intensity >= 0.75
      ? "rgba(239, 68, 68, 0.18)"
      : pt.intensity >= 0.55
      ? "rgba(249, 115, 22, 0.18)"
      : pt.intensity >= 0.35
      ? "rgba(245, 158, 11, 0.18)"
      : "rgba(16, 185, 129, 0.18)";

  const tierBorder =
    pt.intensity >= 0.75
      ? "rgba(239, 68, 68, 0.5)"
      : pt.intensity >= 0.55
      ? "rgba(249, 115, 22, 0.5)"
      : pt.intensity >= 0.35
      ? "rgba(245, 158, 11, 0.5)"
      : "rgba(16, 185, 129, 0.5)";

  return `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 290px; max-width: 330px; background: #0e1424; color: #f8fafc; border-radius: 14px; overflow: hidden; padding: 14px; box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8);">
      <!-- Header: Location & Current Risk Level Badge -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; border-bottom: 1px solid #1f293d; padding-bottom: 10px; margin-bottom: 10px;">
        <div style="min-width: 0;">
          <div style="font-size: 10px; font-weight: 700; color: #38bdf8; font-family: monospace; letter-spacing: 0.5px;">${pt.id}</div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; line-height: 1.25; margin-top: 2px;">${pt.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">📍 ${pt.district}, ${pt.state}</div>
        </div>
        <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: ${tierBg}; color: ${color}; border: 1px solid ${tierBorder}; white-space: nowrap; box-shadow: 0 0 10px ${color}25;">
          ${pt.tier} RISK
        </span>
      </div>

      <!-- Telemetry 2x2 Grid (LSI, 48h Rain, Slope, Soil) -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div style="background: #131b2e; border: 1px solid #1f293d; border-radius: 8px; padding: 8px 10px;">
          <div style="font-size: 10px; font-weight: 600; color: #94a3b8;">LSI Susceptibility</div>
          <div style="font-size: 16px; font-weight: 900; color: ${color}; font-family: monospace; margin-top: 2px;">
            ${(pt.intensity * 100).toFixed(1)}%
          </div>
        </div>
        <div style="background: #131b2e; border: 1px solid #1f293d; border-radius: 8px; padding: 8px 10px;">
          <div style="font-size: 10px; font-weight: 600; color: #94a3b8;">48h Rainfall</div>
          <div style="font-size: 16px; font-weight: 900; color: #38bdf8; font-family: monospace; margin-top: 2px;">
            ${pt.rain48} <span style="font-size: 11px; font-weight: 700; color: #7dd3fc;">mm</span>
          </div>
        </div>
        <div style="background: #131b2e; border: 1px solid #1f293d; border-radius: 8px; padding: 8px 10px;">
          <div style="font-size: 10px; font-weight: 600; color: #94a3b8;">Slope Gradient</div>
          <div style="font-size: 15px; font-weight: 900; color: #fbbf24; font-family: monospace; margin-top: 2px;">
            ${pt.slope}°
          </div>
        </div>
        <div style="background: #131b2e; border: 1px solid #1e293b; border-radius: 8px; padding: 8px 10px;">
          <div style="font-size: 10px; font-weight: 600; color: #94a3b8;">Soil Saturation</div>
          <div style="font-size: 15px; font-weight: 900; color: #60a5fa; font-family: monospace; margin-top: 2px;">
            ${pt.soil}%
          </div>
        </div>
      </div>

      <!-- Suggested Action Callout Box -->
      <div style="background: ${tierBg}; border: 1px solid ${tierBorder}; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px;">
        <div style="font-size: 10px; font-weight: 800; color: ${color}; text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; gap: 4px;">
          ⚡ Suggested Action
        </div>
        <div style="font-size: 11px; color: #f1f5f9; margin-top: 3px; line-height: 1.35; font-weight: 500;">
          ${pt.suggestedAction}
        </div>
      </div>

      <!-- Footer: Last Updated Time -->
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #64748b; padding-top: 6px; border-top: 1px solid #1f293d;">
        <span>🕒 Last Updated: <b style="color: #cbd5e1; font-weight: 600;">${pt.lastUpdated}</b></span>
        <span style="font-size: 9px; color: #38bdf8; font-family: monospace; font-weight: 600;">Telemetry Live</span>
      </div>
    </div>
  `;
};

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  lang,
  onSelectFeature,
  citizenReports = [],
  onVerifyReport,
  focusTarget
}) => {
  const t = translations[lang];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    heatmap?: any;
    polygons?: any;
    roads?: any;
    citizens?: any;
  }>({});
  const spotlightGroupRef = useRef<any>(null);
  const isLocatingRef = useRef<boolean>(false);

  const [activeLayer, setActiveLayer] = useState<"heatmap" | "polygons" | "roads" | "citizens">("heatmap");
  const [hotspotsData, setHotspotsData] = useState<HotspotSector[]>(nerHotspots);
  const [telemetryStatus, setTelemetryStatus] = useState<"live" | "offline">("offline");
  // Default to Cherrapunji Escarpment (first item) as requested by user
  const [selectedItem, setSelectedItem] = useState<any>(nerHotspots[0]);
  const [sirenDispatched, setSirenDispatched] = useState(false);
  const [isSirenModalOpen, setIsSirenModalOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isExpandedMap, setIsExpandedMap] = useState(false);

  // Live Telemetry Handshake with FastAPI Backend (Port 8000)
  useEffect(() => {
    let isMounted = true;
    fetch("http://127.0.0.1:8000/api/v1/risk-zones/hotspots")
      .then((res) => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.hotspots && Array.isArray(data.hotspots)) {
          setHotspotsData((prev: HotspotSector[]) => {
            const liveMap = new Map<string, HotspotSector>(data.hotspots.map((h: any) => [h.id, h as HotspotSector]));
            return prev.map((item: HotspotSector): HotspotSector => liveMap.get(item.id) || item);
          });
          setTelemetryStatus("live");
          console.log("[GIS] Connected to live FastAPI telemetry on Port 8000");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setTelemetryStatus("offline");
          console.log("[GIS] Backend offline or unreachable, using offline-cached hotspots");
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpandedMap = () => {
    setIsExpandedMap((prev) => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);
  };

  // Initialize Leaflet Map with Clean, Watermark-Free Esri Dark Gray Basemap
  useEffect(() => {
    let map: any;

    const initLeaflet = async () => {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Center on North Eastern Region (Sikkim to Assam/Meghalaya)
      map = L.map(mapContainerRef.current, {
        center: [25.8, 92.2],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // 1. Esri World Dark Gray Base (Clean, NO Watermark, NO API Key Required)
      L.tileLayer("https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
        subdomains: ["services"]
      }).addTo(map);

      // 2. Esri World Dark Gray Reference (Labels & State Borders - Clean & High Contrast)
      L.tileLayer("https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 16,
        opacity: 0.85
      }).addTo(map);

      // Add Zoom control at bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      const pointLayerGroup = L.layerGroup();
      const polygonLayerGroup = L.layerGroup();
      const roadLayerGroup = L.layerGroup();
      const citizenLayerGroup = L.layerGroup();
      const spotlightGroup = L.layerGroup().addTo(map);
      spotlightGroupRef.current = spotlightGroup;

      // A. Point Heatmap Markers (Red, Orange, Green)
      nerHotspots.forEach((pt) => {
        const color = pt.intensity >= 0.75 ? "#ef4444" : pt.intensity >= 0.55 ? "#f97316" : pt.intensity >= 0.35 ? "#f59e0b" : "#10b981";
        
        // Pulsing Outer Aura Marker
        const outerCircle = L.circleMarker([pt.lat, pt.lon], {
          radius: pt.intensity >= 0.75 ? 24 : pt.intensity >= 0.55 ? 18 : 12,
          color: color,
          weight: 1.5,
          opacity: 0.85,
          fillColor: color,
          fillOpacity: pt.intensity >= 0.75 ? 0.28 : 0.20
        });

        // Crisp Solid Inner Core
        const coreMarker = L.circleMarker([pt.lat, pt.lon], {
          radius: pt.intensity >= 0.75 ? 7 : 5.5,
          color: "#ffffff",
          weight: 2,
          fillColor: color,
          fillOpacity: 1.0
        });

        const popupHtml = generateMarkerPopupHtml(pt);
        const popupConfig = {
          maxWidth: 340,
          minWidth: 280,
          className: "ner-risk-popup",
          autoPan: true,
          offset: [0, -8] as [number, number]
        };

        coreMarker.bindPopup(popupHtml, popupConfig);
        outerCircle.bindPopup(popupHtml, popupConfig);

        const handleSelect = () => {
          setSelectedItem({ ...pt, isCitizenReport: false });
          if (onSelectFeature) onSelectFeature(pt);
          coreMarker.openPopup();
        };

        outerCircle.on("click", handleSelect);
        coreMarker.on("click", handleSelect);

        const tooltipHtml = `
          <div style="font-family:sans-serif;padding:2px 4px;">
            <b style="font-size:12px;color:#fff;">${pt.name}</b>
            <div style="font-size:10px;color:#94a3b8;margin-top:2px;">${pt.district}, ${pt.state}</div>
            <div style="margin-top:4px;display:flex;align-items:center;gap:4px;">
              <span style="font-weight:bold;color:${color};font-size:11px;">LSI: ${(pt.intensity * 100).toFixed(0)}%</span>
              <span style="background:${color}25;color:${color};border:1px solid ${color}40;padding:1px 4px;border-radius:3px;font-size:9px;font-weight:bold;">${pt.tier}</span>
            </div>
            <div style="font-size:9px;color:#38bdf8;margin-top:3px;">Click to view full risk dossier</div>
          </div>
        `;

        outerCircle.bindTooltip(tooltipHtml, {
          direction: "top",
          className: "leaflet-dark-custom-tooltip"
        });

        pointLayerGroup.addLayer(outerCircle);
        pointLayerGroup.addLayer(coreMarker);
      });

      // B. Hazard Zonation Polygons
      hazardPolygons.forEach((poly) => {
        const polygonItem = L.polygon(poly.coords as any, {
          color: poly.color,
          weight: 2.5,
          opacity: 0.9,
          fillColor: poly.fillColor,
          fillOpacity: 0.25,
          dashArray: poly.tier === "SEVERE" ? "5, 5" : undefined
        });

        polygonItem.on("click", () => {
          const item = {
            id: poly.code,
            name: poly.name,
            district: poly.district,
            state: "NER Sector",
            slope: 42.0,
            rain48: 245.0,
            soil: 91.0,
            intensity: poly.lsi,
            tier: poly.tier,
            insar: -26.0,
            isCitizenReport: false,
            exp_hi: `${poly.name} mein high slope dhalan aur continuous precipitation ke chalte zone ko ${poly.tier} hazard declared kiya gaya hai.`,
            exp_en: `${poly.name} classified as ${poly.tier} hazard based on steep slope topography and extreme rainfall accumulation.`
          };
          setSelectedItem(item);
          if (onSelectFeature) onSelectFeature(item);
        });

        polygonItem.bindTooltip(`<b>${poly.name}</b><br/>Status: <b>${poly.tier} Hazard Zone</b>`, {
          direction: "center"
        });

        polygonLayerGroup.addLayer(polygonItem);
      });

      // C. Road Network Polylines
      highwayCorridors.forEach((rd) => {
        const polyline = L.polyline(rd.path as any, {
          color: rd.color,
          weight: rd.weight,
          opacity: 0.95,
          dashArray: rd.dashArray
        });

        polyline.on("click", () => {
          const item = {
            id: rd.status === "BLOCKED" ? "ROAD-BLOCKED-01" : "ROAD-OPERATIONAL-02",
            name: rd.name,
            district: "Arterial Highway Corridor",
            state: "NER Lifeline",
            slope: 38.0,
            rain48: 180.0,
            soil: 88.0,
            intensity: rd.status === "BLOCKED" ? 0.92 : 0.45,
            tier: rd.status === "BLOCKED" ? "SEVERE" : "MODERATE",
            insar: -24.0,
            isCitizenReport: false,
            exp_hi: `Corridor: ${rd.name}. Status: ${rd.status}. Detour Advisory: ${rd.detour}`,
            exp_en: `Corridor: ${rd.name}. Status: ${rd.status}. Detour Advisory: ${rd.detour}`
          };
          setSelectedItem(item);
          if (onSelectFeature) onSelectFeature(item);
        });

        polyline.bindTooltip(`<b>${rd.name}</b><br/>Status: <b>${rd.status.replace(/_/g, " ")}</b>`, {
          direction: "top"
        });

        roadLayerGroup.addLayer(polyline);

        if (rd.status === "BLOCKED") {
          const blockedMarker = L.circleMarker([27.05, 88.49], {
            radius: 9,
            color: "#ffffff",
            weight: 2,
            fillColor: "#ef4444",
            fillOpacity: 1.0
          });
          blockedMarker.bindPopup(`<b>CRITICAL ROAD BLOCKAGE</b><br/>NH-10 at 29th Mile.<br/>Debris Avalanche.<br/><b>Detour:</b> ${rd.detour}`);
          roadLayerGroup.addLayer(blockedMarker);
        }
      });

      layersRef.current = {
        heatmap: pointLayerGroup,
        polygons: polygonLayerGroup,
        roads: roadLayerGroup,
        citizens: citizenLayerGroup
      };

      // Add default Point Heatmap Layer
      pointLayerGroup.addTo(map);

      mapInstanceRef.current = map;
      setIsMapReady(true);
    };

    initLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Citizen Observation Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current.citizens) return;

    const renderCitizenMarkers = async () => {
      const L = (await import("leaflet")).default;
      const citizenLayer = layersRef.current.citizens;
      citizenLayer.clearLayers();

      citizenReports.forEach((rep) => {
        const isVerified = rep.status === "VERIFIED_TRUE_ALARM";
        const isDismissed = rep.status === "DISMISSED_FALSE_ALARM";
        const badgeColor = isVerified ? "#10b981" : isDismissed ? "#6b7280" : "#f43f5e";

        const cameraDivIcon = L.divIcon({
          className: "custom-camera-marker",
          html: `
            <div style="position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
              <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:${badgeColor};opacity:0.35;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position:relative;width:30px;height:30px;border-radius:50%;background:#090d16;border:2px solid ${badgeColor};display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${badgeColor};cursor:pointer;">
                <span style="font-size:14px;">${rep.mediaType === "video" ? "🎥" : "📸"}</span>
              </div>
              <div style="position:absolute;bottom:-2px;right:-2px;width:10px;height:10px;border-radius:50%;background:${badgeColor};border:1.5px solid white;"></div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19]
        });

        const marker = L.marker([rep.lat, rep.lon], { icon: cameraDivIcon });

        const popupContent = `
          <div style="min-width:210px;font-family:sans-serif;color:#1e293b;">
            <div style="width:100%;height:110px;border-radius:6px;overflow:hidden;margin-bottom:6px;background:#000;">
              ${
                rep.mediaType === "video"
                  ? `<video src="${rep.photoUrl}" controls style="width:100%;height:100%;object-fit:cover;"></video>`
                  : `<img src="${rep.photoUrl}" style="width:100%;height:100%;object-fit:cover;" />`
              }
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <b style="font-size:12px;color:#0f172a;">${rep.hazard}</b>
              <span style="font-size:10px;font-weight:bold;color:${badgeColor};background:${badgeColor}15;padding:1px 5px;border-radius:4px;">${rep.severity}</span>
            </div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">📍 ${rep.location}</div>
            <p style="font-size:11px;color:#334155;margin:4px 0;line-height:1.3;">${rep.desc}</p>
            <div style="font-size:10px;color:#94a3b8;">Reported by: <b>${rep.reporter}</b> &bull; ${rep.time}</div>
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.on("click", () => {
          const reportItem = {
            id: `REPORT-#${rep.id}`,
            name: rep.hazard,
            district: rep.location,
            state: rep.state,
            slope: 41.5,
            rain48: 195.0,
            soil: 89.0,
            intensity: rep.aiCorrelationScore || (rep.severity === "SEVERE" ? 0.92 : 0.75),
            tier: rep.severity,
            insar: -22.0,
            isCitizenReport: true,
            rawReport: rep,
            exp_hi: rep.aiCorrelationNote || `नागरिक ग्राउंड रिपोर्ट: ${rep.desc}`,
            exp_en: rep.aiCorrelationNote || `Ground observation: ${rep.desc}`
          };
          setSelectedItem(reportItem);
          if (onSelectFeature) onSelectFeature(reportItem);
        });

        citizenLayer.addLayer(marker);
      });
    };

    renderCitizenMarkers();
  }, [citizenReports, onSelectFeature]);

  // Handle Layer Toggle dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current.heatmap) return;

    // If an external locate command is in progress, skip the default overview flyTo
    if (isLocatingRef.current) {
      isLocatingRef.current = false;
      return;
    }

    const map = mapInstanceRef.current;
    const { heatmap, polygons, roads, citizens } = layersRef.current;

    if (heatmap) map.removeLayer(heatmap);
    if (polygons) map.removeLayer(polygons);
    if (roads) map.removeLayer(roads);
    if (citizens) map.removeLayer(citizens);

    if (activeLayer === "heatmap" && heatmap) {
      heatmap.addTo(map);
      map.flyTo([25.8, 92.5], 7, { duration: 1.0 });
    } else if (activeLayer === "polygons" && polygons) {
      polygons.addTo(map);
      map.flyTo([25.8, 92.2], 7.2, { duration: 1.0 });
    } else if (activeLayer === "roads" && roads) {
      roads.addTo(map);
      map.flyTo([26.8, 90.5], 7.5, { duration: 1.0 });
    } else if (activeLayer === "citizens" && citizens) {
      citizens.addTo(map);
      map.flyTo([26.2, 91.5], 7.2, { duration: 1.0 });
    }
  }, [activeLayer]);

  // Handle external Focus Target (e.g. clicking "Locate on Map")
  useEffect(() => {
    if (!focusTarget || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    isLocatingRef.current = true;
    setActiveLayer("citizens");

    // Make sure citizen layer is active on the map
    if (layersRef.current.citizens && !map.hasLayer(layersRef.current.citizens)) {
      layersRef.current.citizens.addTo(map);
    }

    const matched = citizenReports.find((r) => r.id === focusTarget.id);

    const placeSpotlightMarker = async () => {
      const L = (await import("leaflet")).default;

      if (!spotlightGroupRef.current) {
        spotlightGroupRef.current = L.layerGroup().addTo(map);
      }
      spotlightGroupRef.current.clearLayers();

      // 1. Radar animated pulse circle around the point
      const radarRing = L.circle([focusTarget.lat, focusTarget.lon], {
        radius: 3500,
        color: "#f43f5e",
        weight: 2.5,
        opacity: 0.9,
        fillColor: "#f43f5e",
        fillOpacity: 0.25
      });

      // 2. High-contrast solid beacon center
      const beaconPoint = L.circleMarker([focusTarget.lat, focusTarget.lon], {
        radius: 12,
        color: "#ffffff",
        weight: 3.5,
        fillColor: "#f43f5e",
        fillOpacity: 1.0
      });

      // 3. High-visibility animated Pin Marker
      const pinMarker = L.marker([focusTarget.lat, focusTarget.lon], {
        icon: L.divIcon({
          className: "custom-spotlight-pin",
          html: `
            <div style="position:relative;width:48px;height:48px;margin-left:-24px;margin-top:-24px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <div style="position:absolute;inset:0;border-radius:50%;background:#f43f5e;opacity:0.45;animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="position:relative;width:36px;height:36px;border-radius:50%;background:#090d16;border:2.5px solid #ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px #f43f5e;">
                <span style="font-size:18px;">📍</span>
              </div>
            </div>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 24]
        })
      });

      if (matched) {
        const popupContent = `
          <div style="min-width:220px;font-family:sans-serif;color:#1e293b;">
            <div style="width:100%;height:110px;border-radius:8px;overflow:hidden;margin-bottom:8px;background:#000;">
              ${
                matched.mediaType === "video"
                  ? `<video src="${matched.photoUrl}" controls style="width:100%;height:100%;object-fit:cover;"></video>`
                  : `<img src="${matched.photoUrl}" style="width:100%;height:100%;object-fit:cover;" />`
              }
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
              <b style="font-size:13px;color:#0f172a;">${matched.hazard}</b>
              <span style="font-size:10px;font-weight:bold;color:#f43f5e;background:#f43f5e15;padding:2px 6px;border-radius:4px;border:1px solid #f43f5e30;">${matched.severity}</span>
            </div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">📍 ${matched.location}</div>
            <p style="font-size:11px;color:#334155;margin:6px 0;line-height:1.4;">${matched.desc}</p>
            <div style="font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:4px;">
              Reported by: <b>${matched.reporter}</b> &bull; ${matched.time}
            </div>
          </div>
        `;
        pinMarker.bindPopup(popupContent);
        beaconPoint.bindPopup(popupContent);
      }

      spotlightGroupRef.current.addLayer(radarRing);
      spotlightGroupRef.current.addLayer(beaconPoint);
      spotlightGroupRef.current.addLayer(pinMarker);

      // Smooth camera flight directly to coordinates
      map.flyTo([focusTarget.lat, focusTarget.lon], 11, { duration: 1.2 });

      setTimeout(() => {
        pinMarker.openPopup();
      }, 700);
    };

    placeSpotlightMarker();

    if (matched) {
      setSelectedItem({
        id: `REPORT-#${matched.id}`,
        name: matched.hazard,
        district: matched.location,
        state: matched.state,
        slope: 41.5,
        rain48: 195.0,
        soil: 89.0,
        intensity: matched.aiCorrelationScore || (matched.severity === "SEVERE" ? 0.92 : 0.75),
        tier: matched.severity,
        insar: -22.0,
        isCitizenReport: true,
        rawReport: matched,
        exp_hi: matched.aiCorrelationNote || `नागरिक ग्राउंड रिपोर्ट: ${matched.desc}`,
        exp_en: matched.aiCorrelationNote || `Ground observation: ${matched.desc}`
      });
    }
  }, [focusTarget, citizenReports]);

  const handleSiren = () => {
    setSirenDispatched(true);
    setIsSirenModalOpen(true);
    setTimeout(() => setSirenDispatched(false), 4000);
  };

  const getColor = (intensity: number) => {
    if (intensity >= 0.75) return "#ef4444";
    if (intensity >= 0.55) return "#f97316";
    if (intensity >= 0.35) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className={`transition-all duration-300 ${
      isExpandedMap
        ? "fixed inset-0 z-[5500] p-3 sm:p-5 bg-black/90 backdrop-blur-xl flex flex-col lg:flex-row gap-3"
        : "relative w-full h-[640px] bg-[#080d1a] rounded-2xl border border-slate-800/90 overflow-hidden flex flex-col lg:flex-row shadow-2xl"
    }`}>
      {/* 1. Master Map Canvas */}
      <div className="flex-1 relative h-full flex flex-col justify-between">
        {/* Floating Top Control Pills */}
        <div className="absolute top-3.5 left-3.5 z-[1000] flex flex-wrap items-center gap-2">
          {/* Layer Selector Bar */}
          <div className="flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-xl text-xs">
            <Layers className="w-3.5 h-3.5 text-sky-400 mr-1" />
            <span className="text-slate-400 font-semibold mr-1">Layer:</span>
            <button
              onClick={() => setActiveLayer("heatmap")}
              className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${
                activeLayer === "heatmap"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              {t.layerHeatmap}
            </button>
            <button
              onClick={() => setActiveLayer("polygons")}
              className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${
                activeLayer === "polygons"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              {t.layerSusceptibility}
            </button>
            <button
              onClick={() => setActiveLayer("roads")}
              className={`px-3 py-1 rounded-lg transition-all text-xs font-bold ${
                activeLayer === "roads"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              {t.layerRoadStatus}
            </button>
            <button
              onClick={() => setActiveLayer("citizens")}
              className={`px-3 py-1 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 ${
                activeLayer === "citizens"
                  ? "bg-rose-600 text-white shadow-sm shadow-rose-600/40"
                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>{t.layerCitizenReports || "Citizen Reports"} ({citizenReports.length})</span>
            </button>
          </div>

          {/* Live Telemetry Status Pill */}
          <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border shadow-xl text-[11px] font-mono backdrop-blur-md transition-all ${
            telemetryStatus === "live"
              ? "bg-emerald-950/80 border-emerald-600/50 text-emerald-300"
              : "bg-slate-900/90 border-slate-700/80 text-slate-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${telemetryStatus === "live" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
            <span className="font-semibold">{telemetryStatus === "live" ? t.fastApiLive : t.telemetryOffline}</span>
          </div>
        </div>

        {/* Quick Hotspot Fly-to Controls (Top Right) */}
        <div className="absolute top-3.5 right-3.5 z-[1000] hidden md:flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-xl text-[11px]">
          <span className="text-slate-400 font-semibold px-1">{t.jumpTo}</span>
          <button
            onClick={() => {
              setSelectedItem(nerHotspots[0]);
              mapInstanceRef.current?.flyTo([25.275, 91.731], 9, { duration: 1.0 });
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-transparent hover:border-slate-600 transition shadow-sm"
          >
            Cherrapunji
          </button>
          <button
            onClick={() => {
              setSelectedItem(nerHotspots[2]);
              mapInstanceRef.current?.flyTo([27.050, 88.490], 9.5, { duration: 1.0 });
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-transparent hover:border-slate-600 transition shadow-sm"
          >
            29th Mile NH-10
          </button>
          <button
            onClick={() => {
              setSelectedItem(nerHotspots[1]);
              mapInstanceRef.current?.flyTo([25.842, 93.435], 9, { duration: 1.0 });
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-transparent hover:border-slate-600 transition shadow-sm"
          >
            Karbi Anglong
          </button>
          <button
            onClick={toggleExpandedMap}
            className="ml-1 p-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white border border-sky-500/30 transition shadow-sm"
            title={isExpandedMap ? "Exit Fullscreen Map" : "Expand Fullscreen GIS Canvas"}
          >
            {isExpandedMap ? <X className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Map Container Element */}
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "380px" }}></div>

        {/* Floating Map Legend (Bottom-Left) */}
        <div className="absolute bottom-3.5 left-3.5 z-[1000] flex items-center space-x-3 text-xs text-slate-400 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 shadow-xl">
          <span className="font-bold text-slate-200">{t.legendRiskScale}</span>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span>{t.lowRisk}</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span>{t.moderateRisk}</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> <span>{t.highRisk}</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> <span>{t.severeRisk}</span></div>
        </div>


      </div>

      {/* 2. Integrated Telemetry & Visual Inspection Deck (Polished Right Panel) */}
      <div className="w-full lg:w-[420px] bg-[#0c1322] border-t lg:border-t-0 lg:border-l border-slate-800/90 p-5 flex flex-col justify-between overflow-y-auto space-y-4 shadow-xl">
        <div className="space-y-4">
          {/* Header Info with Strong Hierarchy */}
          <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/90">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-sky-400 font-mono font-bold">{selectedItem.id}</span>
                {selectedItem.isCitizenReport ? (
                  <span className="text-[10px] bg-rose-500/15 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/30">
                    📸 GROUND OBS
                  </span>
                ) : (
                  <span className="text-[10px] bg-sky-500/15 text-sky-300 font-mono px-2 py-0.5 rounded border border-sky-500/30">
                    AI MONITORED SECTOR
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                {selectedItem.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {selectedItem.district || selectedItem.state}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <div className="text-[10px] text-rose-300 font-mono font-bold bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  <span>3.5km Evac Perimeter</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  ~4,820 Civilians
                </span>
              </div>
            </div>

            {/* Risk Tier Badge */}
            <span
              className="px-3 py-1 rounded-xl text-xs font-black shrink-0 uppercase tracking-wider shadow-sm font-mono"
              style={{
                backgroundColor: `${getColor(selectedItem.intensity)}18`,
                color: getColor(selectedItem.intensity),
                border: `1px solid ${getColor(selectedItem.intensity)}40`
              }}
            >
              {selectedItem.tier}
            </span>
          </div>

          {/* If Selected Item is a Citizen Report -> Render Photo & Action Buttons */}
          {selectedItem.isCitizenReport && selectedItem.rawReport && (
            <div className="space-y-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-black group">
                <img
                  src={selectedItem.rawReport.photoUrl}
                  alt={selectedItem.rawReport.hazard}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1">
                  <Camera className="w-3 h-3 text-rose-400" />
                  <span>{selectedItem.rawReport.time}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-sky-300 font-mono tabular-nums">
                  {selectedItem.rawReport.lat?.toFixed(2)}°N, {selectedItem.rawReport.lon?.toFixed(2)}°E
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-medium">Verification Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    selectedItem.rawReport.status === "VERIFIED_TRUE_ALARM"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : selectedItem.rawReport.status === "DISMISSED_FALSE_ALARM"
                      ? "bg-slate-800 text-slate-400 border border-slate-700"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                  }`}
                >
                  {selectedItem.rawReport.status.replace(/_/g, " ")}
                </span>
              </div>

              {onVerifyReport && selectedItem.rawReport.status === "PENDING_REVIEW" && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onVerifyReport(selectedItem.rawReport.id, "VERIFIED_TRUE_ALARM");
                      setSelectedItem((prev: any) => ({
                        ...prev,
                        rawReport: { ...prev.rawReport, status: "VERIFIED_TRUE_ALARM" }
                      }));
                    }}
                    className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify & Alert</span>
                  </button>
                  <button
                    onClick={() => {
                      onVerifyReport(selectedItem.rawReport.id, "DISMISSED_FALSE_ALARM");
                      setSelectedItem((prev: any) => ({
                        ...prev,
                        rawReport: { ...prev.rawReport, status: "DISMISSED_FALSE_ALARM" }
                      }));
                    }}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Landslide Susceptibility Index (LSI) Gauge with Illuminated Bar */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2.5 shadow-inner">
            <div className="flex justify-between items-baseline text-xs text-slate-300 font-medium">
              <span className="font-semibold text-slate-200">Landslide Susceptibility Index (LSI)</span>
              <span
                className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums"
                style={{
                  color: getColor(selectedItem.intensity)
                }}
              >
                {(selectedItem.intensity * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${selectedItem.intensity * 100}%`,
                  backgroundColor: getColor(selectedItem.intensity)
                }}
              ></div>
            </div>
          </div>

          {/* Multi-Source Geotechnical Metrics (2x2 Grid with Strong Hierarchy & Failure Threshold Verification) */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-200 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-semibold">{t.slopeGradient}</span>
                </div>
                {selectedItem.slope > 35 && (
                  <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded">
                    &gt;35° {lang === "hi" ? "गंभीर" : "CRITICAL"}
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-1">
                <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">{selectedItem.slope}</p>
                <span className="text-xs font-bold text-amber-400 font-mono">°</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">SRTM 30m DEM</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-200 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-[11px] font-semibold">{lang === "hi" ? "48 घंटे वर्षा" : "48h Rain"}</span>
                </div>
                {selectedItem.rain48 > 150 && (
                  <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded animate-pulse">
                    {lang === "hi" ? "सीमा पार" : "BREACHED"}
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-1">
                <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">{selectedItem.rain48}</p>
                <span className="text-xs font-bold text-sky-400 font-mono">mm</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">IMD AWS Gauge</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-200 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-semibold">{t.soilSaturation}</span>
                </div>
                {selectedItem.soil > 80 && (
                  <span className="text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.5 rounded">
                    {lang === "hi" ? "संतृप्त" : "PORE SURGE"}
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-1">
                <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">{selectedItem.soil}</p>
                <span className="text-xs font-bold text-blue-400 font-mono">%</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">NASA SMAP L4</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-200 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[11px] font-semibold">{t.insarCreep}</span>
                </div>
                {Math.abs(selectedItem.insar) > 15 && (
                  <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded">
                    {lang === "hi" ? "सक्रिय विस्थापन" : "ACTIVE SLIP"}
                  </span>
                )}
              </div>
              <div className="flex items-baseline space-x-1">
                <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight tabular-nums">{selectedItem.insar}</p>
                <span className="text-xs font-bold text-rose-400 font-mono">mm/yr</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-mono">Sentinel-1 InSAR</span>
            </div>
          </div>

          {/* Visual AI Cause Explanation Section with Horizontal Contribution Bars */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-sky-900/35 text-xs space-y-3 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {t.aiCauseExplanation}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Feature Contribution &bull; TreeSHAP v0.42
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                {lang === "hi" ? "सटीकता 94.8%" : "Confidence 94.8%"}
              </span>
            </div>

            {/* Horizontal Feature Contribution Bars */}
            <div className="space-y-2.5 pt-1">
              {(selectedItem.aiContributions || [
                { name: "Rainfall (Antecedent 48h)", pct: 42, color: "#38bdf8", gradient: "from-sky-500 to-blue-500" },
                { name: "Slope Gradient (SRTM DEM)", pct: 28, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
                { name: "Soil Moisture Saturation", pct: 18, color: "#60a5fa", gradient: "from-blue-500 to-indigo-500" },
                { name: "InSAR Surface Creep", pct: 12, color: "#f43f5e", gradient: "from-rose-500 to-pink-500" }
              ]).map((contrib: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: contrib.color }}
                      ></span>
                      <span>{contrib.name}</span>
                    </div>
                    <span
                      className="font-mono font-black text-xs tabular-nums"
                      style={{ color: contrib.color }}
                    >
                      {contrib.pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${contrib.gradient} transition-all duration-500`}
                      style={{
                        width: `${contrib.pct}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Qualitative Narrative Summary */}
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-slate-300 leading-relaxed text-[11px] font-normal">
                {lang === "hi" ? selectedItem.exp_hi : selectedItem.exp_en}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Emergency Siren Broadcast */}
        <div className="pt-2">
          <button
            onClick={handleSiren}
            disabled={sirenDispatched}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
              sirenDispatched
                ? "bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400"
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 hover:shadow-rose-600/40 active:scale-[0.99]"
            }`}
          >
            {sirenDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.sirenDispatched}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span>{t.sirenButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evacuation Broadcast Simulator Modal */}
      <EvacuationSirenModal
        isOpen={isSirenModalOpen}
        onClose={() => setIsSirenModalOpen(false)}
        sectorData={selectedItem}
        lang={lang}
      />
    </div>
  );
};
