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

// 1. Point Heatmap Hotspots across 8 NER States
const nerHotspots = [
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
    exp_hi: "Pichle 48 ghanto ki bhaari baarish (260.4mm) + mitti mein 94% saturation + steep 44.2° dhalan ki wajah se risk SEVERE hai.",
    exp_en: "Severe risk driven by 260.4mm 48h rainfall + 94% saturated soil on steep 44.2° sandstone slope."
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
    exp_hi: "Lumding-Diphu highway cutting par 265mm baarish aur 34.8mm/yr InSAR subsidence ki wajah se catastrophic failure alert.",
    exp_en: "Critical road cut failure alert driven by 265mm rain and 34.8mm/yr active InSAR subsidence along SH-19."
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
    exp_hi: "Teesta nadi ke kataav aur InSAR creep ki wajah se NH-10 arterial highway par debris avalanche active hai.",
    exp_en: "Active debris avalanche blocking NH-10 corridor caused by river toe erosion and heavy 195mm rainfall."
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
    exp_hi: "InSAR surface creep (14.2mm/yr) aur 86.5% saturated soil se one-way police convoy chalai ja rahi hai.",
    exp_en: "Active InSAR surface creep (14.2mm/yr) + 86.5% soil saturation creates critical slope shear hazard along NH-10."
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
    exp_hi: "Clay-shale strata mein 110mm baarish ke baad moderate creep darj hua hai.",
    exp_en: "Elevated risk on clay-shale strata due to 110mm antecedent rainfall and railway slope cutting."
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
    exp_hi: "Active thrust fault aur 98mm baarish ki wajah se highway slip hazard elevated hai.",
    exp_en: "Thrust fault zone activation with 98mm rain creating elevated highway slip warning."
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
    exp_hi: "Nami aur dhalan surakshit sima ke andar hain. Normal advisory active hai.",
    exp_en: "Soil moisture and precipitation well within geotechnical safety margins."
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
    exp_hi: "Border road cutting par heavy rain saturation ki wajah se rockfall alert jaari kiya gaya hai.",
    exp_en: "Border road cut section on high rainfall saturation prone to rockfall."
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
    exp_hi: "Railway bridge construction zone ke paas soil creep monitor kiya ja raha hai.",
    exp_en: "Slope monitoring near railway infrastructure with 125mm antecedent rainfall."
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
  // Default to Cherrapunji Escarpment (first item) as requested by user
  const [selectedItem, setSelectedItem] = useState<any>(nerHotspots[0]);
  const [sirenDispatched, setSirenDispatched] = useState(false);
  const [isSirenModalOpen, setIsSirenModalOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

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

        const handleSelect = () => {
          setSelectedItem({ ...pt, isCitizenReport: false });
          if (onSelectFeature) onSelectFeature(pt);
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
    <div className="relative w-full h-[620px] bg-[#0b0f19] rounded-2xl border border-gray-800/90 overflow-hidden flex flex-col lg:flex-row shadow-2xl">
      {/* 1. Master Map Canvas */}
      <div className="flex-1 relative h-full flex flex-col justify-between">
        {/* Floating Top Control Pills */}
        <div className="absolute top-3.5 left-3.5 z-[1000] flex flex-wrap items-center gap-2">
          {/* Layer Selector Bar */}
          <div className="flex items-center space-x-1.5 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-700/80 shadow-2xl text-xs">
            <Layers className="w-3.5 h-3.5 text-sky-400 mr-1" />
            <span className="text-gray-400 font-semibold mr-1">Layer:</span>
            <button
              onClick={() => setActiveLayer("heatmap")}
              className={`px-3 py-1.5 rounded-lg transition text-xs font-bold ${
                activeLayer === "heatmap"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {t.layerHeatmap}
            </button>
            <button
              onClick={() => setActiveLayer("polygons")}
              className={`px-3 py-1.5 rounded-lg transition text-xs font-bold ${
                activeLayer === "polygons"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {t.layerSusceptibility}
            </button>
            <button
              onClick={() => setActiveLayer("roads")}
              className={`px-3 py-1.5 rounded-lg transition text-xs font-bold ${
                activeLayer === "roads"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                  : "text-gray-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {t.layerRoadStatus}
            </button>
            <button
              onClick={() => setActiveLayer("citizens")}
              className={`px-3 py-1.5 rounded-lg transition text-xs font-bold flex items-center gap-1.5 ${
                activeLayer === "citizens"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>{t.layerCitizenReports || "Citizen Reports"} ({citizenReports.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Hotspot Fly-to Controls (Top Right) */}
        <div className="absolute top-3.5 right-3.5 z-[1000] hidden md:flex items-center space-x-1.5 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-gray-700/80 shadow-2xl text-[11px]">
          <span className="text-gray-400 font-semibold px-1">Jump:</span>
          <button
            onClick={() => {
              setSelectedItem(nerHotspots[0]);
              mapInstanceRef.current?.flyTo([25.275, 91.731], 9, { duration: 1.0 });
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-200 font-medium transition"
          >
            Cherrapunji
          </button>
          <button
            onClick={() => {
              setSelectedItem(nerHotspots[2]);
              mapInstanceRef.current?.flyTo([27.050, 88.490], 9.5, { duration: 1.0 });
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-200 font-medium transition"
          >
            29th Mile NH-10
          </button>
          <button
            onClick={() => {
              setSelectedItem(nerHotspots[1]);
              mapInstanceRef.current?.flyTo([25.842, 93.435], 9, { duration: 1.0 });
            }}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-200 font-medium transition"
          >
            Karbi Anglong
          </button>
        </div>

        {/* Map Container Element */}
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "380px" }}></div>

        {/* Floating Map Legend (Bottom-Left) */}
        <div className="absolute bottom-3.5 left-3.5 z-[1000] flex items-center space-x-3 text-xs text-gray-400 bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-800 shadow-2xl">
          <span className="font-bold text-gray-200">{t.legendRiskScale}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {t.lowRisk}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {t.moderateRisk}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> {t.highRisk}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span> {t.severeRisk}</span>
        </div>

        {/* Clean Basemap Label with Live Status (Bottom-Right, Zero Overlap) */}
        <div className="absolute bottom-3.5 right-3.5 z-[1000] hidden sm:flex items-center space-x-2 bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-gray-800 text-[11px] text-gray-300 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-gray-300">Esri Dark Gray Canvas &bull; Watermark-Free</span>
        </div>
      </div>

      {/* 2. Integrated Telemetry & Visual Inspection Deck (Polished Right Panel) */}
      <div className="w-full lg:w-[410px] bg-[#0e1424] border-t lg:border-t-0 lg:border-l border-gray-800 p-5 flex flex-col justify-between overflow-y-auto space-y-4 shadow-xl">
        <div className="space-y-4">
          {/* Header Info with Strong Hierarchy */}
          <div className="flex items-start justify-between pb-3.5 border-b border-gray-800/90">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-sky-400 font-mono font-bold">{selectedItem.id}</span>
                {selectedItem.isCitizenReport ? (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/40">
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
              <p className="text-xs text-gray-400 font-medium">
                {selectedItem.district || selectedItem.state}
              </p>
            </div>

            {/* Risk Tier Badge */}
            <span
              className="px-3 py-1 rounded-xl text-xs font-black shrink-0 uppercase tracking-wider shadow-md"
              style={{
                backgroundColor: `${getColor(selectedItem.intensity)}20`,
                color: getColor(selectedItem.intensity),
                border: `1px solid ${getColor(selectedItem.intensity)}50`,
                boxShadow: `0 0 12px ${getColor(selectedItem.intensity)}25`
              }}
            >
              {selectedItem.tier}
            </span>
          </div>

          {/* If Selected Item is a Citizen Report -> Render Photo & Action Buttons */}
          {selectedItem.isCitizenReport && selectedItem.rawReport && (
            <div className="space-y-3 p-3.5 bg-slate-900/90 rounded-2xl border border-gray-700 shadow-inner">
              <div className="relative h-44 rounded-xl overflow-hidden border border-gray-700 bg-black group">
                <img
                  src={selectedItem.rawReport.photoUrl}
                  alt={selectedItem.rawReport.hazard}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white font-mono flex items-center gap-1">
                  <Camera className="w-3 h-3 text-rose-400" />
                  <span>{selectedItem.rawReport.time}</span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-sky-300 font-mono">
                  {selectedItem.rawReport.lat?.toFixed(2)}°N, {selectedItem.rawReport.lon?.toFixed(2)}°E
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-gray-400 font-medium">Verification Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                    selectedItem.rawReport.status === "VERIFIED_TRUE_ALARM"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : selectedItem.rawReport.status === "DISMISSED_FALSE_ALARM"
                      ? "bg-gray-800 text-gray-400 border border-gray-700"
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
                    className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition"
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
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-gray-700 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Landslide Susceptibility Index (LSI) Gauge with Illuminated Bar */}
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-gray-800 space-y-2 shadow-inner">
            <div className="flex justify-between items-baseline text-xs text-gray-300 font-medium">
              <span className="font-semibold text-gray-200">Landslide Susceptibility Index (LSI)</span>
              <span className="text-base font-black text-white font-mono tracking-tight">
                {(selectedItem.intensity * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-gray-800">
              <div
                className="h-full rounded-full transition-all duration-700 shadow-sm"
                style={{
                  width: `${selectedItem.intensity * 100}%`,
                  backgroundColor: getColor(selectedItem.intensity),
                  boxShadow: `0 0 10px ${getColor(selectedItem.intensity)}`
                }}
              ></div>
            </div>
          </div>

          {/* Multi-Source Geotechnical Metrics (2x2 Grid with Strong Hierarchy) */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-gray-800 hover:border-gray-700 transition space-y-1">
              <div className="flex items-center space-x-1.5 text-gray-400">
                <Mountain className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-medium">Slope Gradient</span>
              </div>
              <p className="text-lg font-black text-white font-mono">{selectedItem.slope}°</p>
              <span className="text-[10px] text-gray-500 block">SRTM 30m DEM</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-gray-800 hover:border-gray-700 transition space-y-1">
              <div className="flex items-center space-x-1.5 text-gray-400">
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-[11px] font-medium">48h Rain</span>
              </div>
              <p className="text-lg font-black text-white font-mono">{selectedItem.rain48} mm</p>
              <span className="text-[10px] text-gray-500 block">IMD AWS Gauge</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-gray-800 hover:border-gray-700 transition space-y-1">
              <div className="flex items-center space-x-1.5 text-gray-400">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-medium">Soil Saturation</span>
              </div>
              <p className="text-lg font-black text-white font-mono">{selectedItem.soil}%</p>
              <span className="text-[10px] text-gray-500 block">NASA SMAP L4</span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-xl border border-gray-800 hover:border-gray-700 transition space-y-1">
              <div className="flex items-center space-x-1.5 text-gray-400">
                <Activity className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-medium">InSAR Creep</span>
              </div>
              <p className="text-lg font-black text-white font-mono">{selectedItem.insar} mm/yr</p>
              <span className="text-[10px] text-gray-500 block">Sentinel-1 InSAR</span>
            </div>
          </div>

          {/* AI Multilingual SHAP Explainability Card */}
          <div className="p-3.5 rounded-2xl bg-sky-950/20 border border-sky-800/40 text-xs space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-sky-300">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>AI Attribution (SHAP)</span>
              </div>
              <span className="text-[10px] bg-sky-500/20 text-sky-200 px-2 py-0.5 rounded font-mono">
                TreeSHAP v0.42
              </span>
            </div>
            <p className="text-sky-100/90 leading-relaxed text-[11px] font-normal">
              {lang === "hi" ? selectedItem.exp_hi : selectedItem.exp_en}
            </p>
          </div>
        </div>

        {/* Action Button: Emergency Siren Broadcast */}
        <div className="pt-2">
          <button
            onClick={handleSiren}
            disabled={sirenDispatched}
            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl ${
              sirenDispatched
                ? "bg-emerald-600 text-white shadow-emerald-600/40 ring-2 ring-emerald-400"
                : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30 hover:shadow-rose-600/50"
            }`}
          >
            {sirenDispatched ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>SIREN & SMS BROADCAST DISPATCHED</span>
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
