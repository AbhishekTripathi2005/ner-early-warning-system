"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AlertBanner } from "../components/alerts/AlertBanner";
import { StatCards } from "../components/dashboard/StatCards";
import { RoadStatusPanel } from "../components/dashboard/RoadStatusPanel";
import { WeatherForecastWidget } from "../components/dashboard/WeatherForecastWidget";
import { ResponsePrioritizationList } from "../components/dashboard/ResponsePrioritizationList";
import { HistoricalTrendsChart } from "../components/dashboard/HistoricalTrendsChart";
import { OfficerReviewPanel } from "../components/dashboard/OfficerReviewPanel";
import { OfficerLoginModal } from "../components/dashboard/OfficerLoginModal";
import { CitizenReportModal, CitizenReportData } from "../components/reporting/CitizenReportModal";
import { SitRepModal } from "../components/dashboard/SitRepModal";
import { OfflineStatusBadge } from "../components/common/OfflineStatusBadge";

const HeatmapViewer = dynamic(
  () => import("../components/gis/HeatmapViewer").then((mod) => mod.HeatmapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-2xl bg-[#090d16] border border-slate-800 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span>LOADING ESRI DARK GRAY GIS ENGINE...</span>
        </div>
      </div>
    )
  }
);

const LiveTelemetryExplorer = dynamic(
  () => import("../components/dashboard/LiveTelemetryExplorer").then((mod) => mod.LiveTelemetryExplorer),
  { ssr: false }
);
import { Language, translations } from "../lib/i18n";
import { QueuedCitizenReport } from "../lib/offlineDb";
import {
  Shield,
  Activity,
  RefreshCw,
  Globe,
  UserCheck,
  Radio,
  Route,
  CloudRain,
  Users,
  BarChart3,
  ClipboardCheck,
  Clock,
  Camera,
  Video,
  LogOut,
  Lock,
  Zap,
  FileText
} from "lucide-react";

// Default authentic citizen reports across NER with photo & video coverage
const defaultCitizenReports: CitizenReportData[] = [
  {
    id: 501,
    reporter: "Tashi Bhutia",
    phone: "+91-98765-43210",
    location: "Singtam Flank, East Sikkim",
    district: "East Sikkim",
    state: "Sikkim",
    lat: 27.23,
    lon: 88.50,
    hazard: "New Hill Fissure / Creep",
    severity: "SEVERE",
    desc: "5-inch wide lateral ground crack opening across terrace slope behind community school.",
    photoUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    mediaType: "image",
    status: "PENDING_REVIEW",
    time: "25 mins ago",
    aiCorrelationScore: 0.92,
    aiCorrelationNote: "Ground crack coordinates align with 89% slope susceptibility index & 195mm rainfall. InSAR creep detected within 500m.",
    slope: 41.5,
    rain48: 195.0,
    soil: 89.0,
    insar: -22.0,
    elevation: 1390,
    isLiveTelemetry: true,
    telemetrySource: "Singtam AWS Ground Station"
  },
  {
    id: 502,
    reporter: "Babulal Boro",
    phone: "+91-94351-99882",
    location: "Haflong Hill Cutting, Dima Hasao",
    district: "Dima Hasao",
    state: "Assam",
    lat: 25.17,
    lon: 93.02,
    hazard: "Active Highway Mudflow & Gravel",
    severity: "SEVERE",
    desc: "12s clip of saturated gravel sliding down cut slope directly obstructing transit lane.",
    photoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    mediaType: "video",
    durationSeconds: 12,
    status: "PENDING_REVIEW",
    time: "15 mins ago",
    aiCorrelationScore: 0.95,
    aiCorrelationNote: "Cloudburst zone radar echo 48 dBZ. Severe dynamic instability verified.",
    slope: 36.2,
    rain48: 168.0,
    soil: 84.0,
    insar: -18.5,
    elevation: 680,
    isLiveTelemetry: true,
    telemetrySource: "Haflong AWS Ground Station"
  },
  {
    id: 503,
    reporter: "Donboklang Lyngdoh",
    phone: "+91-94361-11223",
    location: "Cherrapunji Escarpment, Meghalaya",
    district: "East Khasi Hills",
    state: "Meghalaya",
    lat: 25.28,
    lon: 91.73,
    hazard: "Retaining Wall Bulging",
    severity: "HIGH",
    desc: "Concrete retaining wall tilting outward with muddy spring seepage emerging from hillside.",
    photoUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    mediaType: "image",
    status: "VERIFIED_TRUE_ALARM",
    time: "2 hours ago",
    aiCorrelationScore: 0.94,
    aiCorrelationNote: "Sohra escarpment high rainfall zone (260.4mm/48h). Saturated shear failure confirmed by geological survey.",
    slope: 32.8,
    rain48: 260.4,
    soil: 91.5,
    insar: -14.2,
    elevation: 1430,
    isLiveTelemetry: true,
    telemetrySource: "Sohra AWS Ground Station"
  }
];

export default function DashboardPage() {
  const [lang, setLang] = useState<Language>("en");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSitRepModalOpen, setIsSitRepModalOpen] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"roads" | "weather" | "live" | "priorities" | "history" | "review">("roads");
  const [currentTime, setCurrentTime] = useState("");
  const [citizenReports, setCitizenReports] = useState<CitizenReportData[]>(defaultCitizenReports);
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lon: number; id: number; _ts?: number } | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"command" | "citizen">("command");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Tactical Operations Center Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === "1") setActiveTab("roads");
      if (e.key === "2") setActiveTab("weather");
      if (e.key === "3") setActiveTab("live");
      if (e.key === "4") setActiveTab("priorities");
      if (e.key === "5") setActiveTab("history");
      if (e.key === "6") setActiveTab("review");
      if (e.key === "s" || e.key === "S") setIsSitRepModalOpen((prev) => !prev);
      if (e.key === "r" || e.key === "R") setIsReportModalOpen((prev) => !prev);
      if (e.key === "c" || e.key === "C") setViewMode((prev) => (prev === "command" ? "citizen" : "command"));
      if (e.key === "Escape") {
        setIsLoginModalOpen(false);
        setIsReportModalOpen(false);
        setIsSitRepModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Ensure active tab is citizen-safe when switching personas
  useEffect(() => {
    if (viewMode === "citizen" && (activeTab === "priorities" || activeTab === "history")) {
      setActiveTab("roads");
    }
  }, [viewMode, activeTab]);

  // Track online/offline status for dynamic AI badge and telemetry
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const t = translations[lang] || translations.en;

  // Register Service Worker on client mount
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[SW] Registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[SW] Registration failed:", err);
        });
    }
  }, []);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" }) + " IST");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewReport = (newReport: CitizenReportData) => {
    setCitizenReports((prev) => [newReport, ...prev]);
    setFocusTarget({ lat: newReport.lat, lon: newReport.lon, id: newReport.id, _ts: Date.now() });
    const mapEl = document.getElementById("gis-map-section");
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const handleSyncQueuedReports = (syncedList: QueuedCitizenReport[]) => {
    const formatted: CitizenReportData[] = syncedList.map((r) => ({
      ...r,
      isOfflineQueued: false,
      time: "Synced just now"
    }));
    setCitizenReports((prev) => {
      const ids = new Set(prev.map((p) => p.id));
      const newItems = formatted.filter((f) => !ids.has(f.id));
      return [...newItems, ...prev];
    });
  };

  const handleVerifyReport = (id: number, status: "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM") => {
    if (!currentOfficer) {
      setIsLoginModalOpen(true);
      return;
    }
    setCitizenReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleLocateOnMap = (report: CitizenReportData) => {
    setFocusTarget({ lat: report.lat, lon: report.lon, id: report.id, _ts: Date.now() });
    const mapEl = document.getElementById("gis-map-section");
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen p-2.5 sm:p-4 md:p-6 max-w-[1640px] mx-auto space-y-4 sm:space-y-5 bg-[#070b14] text-slate-100 overflow-x-hidden w-full">
      {/* 0. Offline Field Mode Banner (Listens to network connectivity) */}
      <OfflineStatusBadge onSyncReports={handleSyncQueuedReports} />

      {/* 1. Command Center Top Header (Mobile & Desktop Unified) */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 sm:p-4.5 rounded-2xl bg-[#0c1322] border border-slate-800/90 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white uppercase truncate">
                {viewMode === "citizen" ? t.citizenPortalTitle : t.title}
              </h1>
              <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold shrink-0 ${
                viewMode === "citizen"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/35"
                  : "bg-sky-500/15 text-sky-300 border-sky-500/35"
              }`}>
                {viewMode === "citizen" ? t.publicSafetyView : "SIH26001 • MDoNER • NDMA"}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
              {viewMode === "citizen" ? t.citizenPortalSubtitle : t.subtitle}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Dual-Persona Switcher: Cockpit Relief for Citizens & Non-Technical Judges */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 shadow-sm text-xs">
            <button
              onClick={() => setViewMode("command")}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === "command"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Full Tactical Command: InSAR telemetry, raw sensor streams & SitRep memorandum"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{t.tacticalCommand}</span>
              <span className="sm:hidden">{lang === "hi" ? "कमांड" : "Command"}</span>
            </button>
            <button
              onClick={() => setViewMode("citizen")}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === "citizen"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Citizen Safe View: Jargon-free road status, helplines & 1-click hazard reporting"
            >
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">{t.citizenSafeView}</span>
              <span className="sm:hidden">{lang === "hi" ? "नागरिक" : "Citizen"}</span>
            </button>
          </div>

          {/* Live Station Telemetry Direct CTA Button */}
          <button
            onClick={() => {
              setActiveTab("live");
              const sec = document.getElementById("operations-deck-section");
              if (sec) sec.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-xl shadow-sm transition-all duration-150 border ${
              activeTab === "live"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30"
                : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40 hover:text-emerald-200"
            }`}
            title="Search any location in India for real-time Open-Meteo telemetry & LSI score"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{t.liveTelemetryTab}</span>
            <span className="sm:hidden">{lang === "hi" ? "लाइव" : "Live"}</span>
          </button>

          {/* Photo & Video Hazard Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wide px-3 py-2 rounded-xl shadow-sm hover:shadow-rose-600/30 active:scale-[0.98] transition-all duration-150"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.reportHazard}</span>
          </button>

          {/* Live IST Clock */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-950 border border-slate-800 px-2.5 py-2 rounded-xl text-slate-300 font-mono tabular-nums shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-semibold">{hasMounted ? currentTime : "LIVE IST"}</span>
          </div>

          {/* AI Engine Status (Dynamic Online vs Local Edge Cache State) */}
          {hasMounted && !isOnline ? (
            <div className="flex items-center space-x-1.5 text-xs bg-amber-500/15 border border-amber-500/35 text-amber-300 px-2.5 py-2 rounded-xl font-medium shadow-sm animate-pulse">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline font-semibold font-mono">AI Engine: LOCAL (Edge Cache)</span>
              <span className="sm:hidden font-mono font-bold text-[10px]">AI LOCAL</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-2.5 py-2 rounded-xl font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline font-semibold">{t.aiOnline}</span>
              <span className="sm:hidden font-mono font-bold text-[10px]">AI OK</span>
            </div>
          )}

          {/* 5-Language Multilingual Selector (EN, Hindi, Assamese, Bodo, Khasi) */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs shadow-sm overflow-x-auto max-w-full">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 shrink-0" />
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "en" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "hi" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang("as")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "as" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => setLang("brx")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "brx" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Bodo Language (बर' राव)"
            >
              बर'
            </button>
            <button
              onClick={() => setLang("kha")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "kha" ? "bg-sky-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
              title="Khasi Language (Ka Ktien Khasi)"
            >
              Khasi
            </button>
          </div>

          {/* Officer Auth & Logout Controls */}
          {currentOfficer ? (
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1.5 rounded-xl font-medium shadow-sm">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-[11px] truncate max-w-[120px]">{currentOfficer.name}</span>
              </div>
              <button
                onClick={() => setCurrentOfficer(null)}
                className="flex items-center space-x-1 text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white font-bold px-2 py-1.5 rounded-xl border border-rose-500/30 transition shadow-sm"
                title="Logout of Officer Mode (Return to Citizen View)"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold px-3 py-2 rounded-xl border border-slate-700 hover:border-slate-600 transition shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.officerLogin}</span>
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 p-2 rounded-xl border border-slate-700 hover:border-slate-600 transition shadow-sm shrink-0"
            title="Refresh All Real-time Streams"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 1.5 Dynamic Readiness Strip (OPCON HUD in Command Mode vs Public Safety Advisory in Citizen Mode) */}
      {viewMode === "command" ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-[#0a101d] border border-slate-800 shadow-md">
          <div className="flex items-center space-x-2.5 overflow-x-auto max-w-full">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/35 text-red-300 font-mono text-xs font-black shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              <span>{t.opconLevel}</span>
            </div>

            <div className="hidden md:flex items-center space-x-2 text-[11px] font-mono text-slate-400 shrink-0">
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>SK: <b className="text-rose-400">RED</b></span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>ML: <b className="text-rose-400">RED</b></span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>AS: <b className="text-amber-400">ORANGE</b></span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>AR: <b className="text-amber-400">YELLOW</b></span>
              </div>
              <div className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>MZ: <b className="text-emerald-400">GREEN</b></span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <span className="hidden xl:inline text-[10px] text-slate-500 font-mono">
              {t.shortcutsHint}
            </span>
            <button
              onClick={() => setIsSitRepModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-white border border-amber-500/35 rounded-xl text-xs font-bold transition shadow-sm active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.generateSitRep}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{t.safetyAdvisoryTitle}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">{t.officialSdrfAdvisory}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {t.safetyAdvisoryDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <a
              href="tel:1070"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-emerald-600/25"
            >
              <span>{t.helplineTollFree}</span>
            </a>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.reportHazard}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Emergency Dispatches Ticker with Voice Alert (Text-to-Speech) */}
      <AlertBanner lang={lang} />

      {/* 3. Real-Time Telemetry KPI Statistics vs Simplified Citizen Cards */}
      {viewMode === "command" ? (
        <StatCards isOnline={isOnline} lang={lang} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Citizen Card 1: Area Safety */}
          <div className="p-4 rounded-2xl bg-[#0c1322] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.vicinitySafetyTitle}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-base font-bold text-emerald-400">{t.vicinitySafetyStatus}</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.vicinitySafetyDesc}
            </p>
          </div>

          {/* Citizen Card 2: Highway Transit */}
          <div className="p-4 rounded-2xl bg-[#0c1322] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.highwayCorridorsTitle}</span>
              <Route className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-base font-bold text-white">{t.highwayCorridorsStatus}</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.highwayCorridorsDesc}
            </p>
          </div>

          {/* Citizen Card 3: Community Emergency Help */}
          <div className="p-4 rounded-2xl bg-[#0c1322] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t.emergencyAssistanceTitle}</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-bold text-amber-300">{t.emergencyAssistanceStatus}</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.emergencyAssistanceDesc}
            </p>
          </div>
        </div>
      )}

      {/* 4. Master Interactive GIS Map & Cherrapunji Detail Panel */}
      <section id="gis-map-section" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.interactiveMapTitle}
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono hidden sm:inline">
            Spatial Projection: EPSG:4326 &bull; WGS 84
          </span>
        </div>
        <HeatmapViewer
          lang={lang}
          citizenReports={citizenReports}
          onVerifyReport={handleVerifyReport}
          focusTarget={focusTarget}
        />
      </section>

      {/* 5. Clear Operations Deck Navigation Tabs & Panels */}
      <section id="operations-deck-section" className="p-3.5 sm:p-5 rounded-2xl bg-[#0c1322] border border-slate-800/90 space-y-4 shadow-xl">
        {/* Modern Segmented Tab Bar with Horizontal Scroll for Small Screens */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/90">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("roads")}
              className={`px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-150 shrink-0 ${
                activeTab === "roads"
                  ? "bg-sky-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 font-medium"
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>{t.roadStatusTitle}</span>
            </button>

            <button
              onClick={() => setActiveTab("weather")}
              className={`px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-150 shrink-0 ${
                activeTab === "weather"
                  ? "bg-sky-600 text-white shadow-sm font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 font-medium"
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{t.weatherForecastTitle}</span>
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-150 shrink-0 ${
                activeTab === "live"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "text-emerald-400 hover:text-emerald-300 hover:bg-slate-900 font-medium"
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>{t.liveTelemetryTab}</span>
            </button>

            {/* Tactical Command Only Decks: Priorities & Historical Trends (Hidden in Citizen View to Eliminate Cockpit Effect) */}
            {viewMode === "command" && (
              <>
                <button
                  onClick={() => setActiveTab("priorities")}
                  className={`px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-150 shrink-0 ${
                    activeTab === "priorities"
                      ? "bg-sky-600 text-white shadow-sm font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 font-medium"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{t.prioritizationTitle}</span>
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-150 shrink-0 ${
                    activeTab === "history"
                      ? "bg-sky-600 text-white shadow-sm font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 font-medium"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{t.historicalTrendsTitle}</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab("review")}
              className={`px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all duration-150 shrink-0 ${
                activeTab === "review"
                  ? "bg-rose-600 text-white shadow-sm font-bold"
                  : "text-rose-400 hover:text-rose-300 hover:bg-slate-900 font-medium"
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{viewMode === "citizen" ? (lang === "hi" ? "नागरिक आपदा रिपोर्ट्स" : lang === "as" ? "ৰাইজৰ দুৰ্যোগ প্ৰতিবেদন" : "Community Reports") : t.citizenReviewTitle}</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-black/40 border border-rose-400/40 font-mono font-bold tabular-nums">
                {citizenReports.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] font-mono hidden sm:flex items-center space-x-2">
            {viewMode === "citizen" ? (
              <span className="text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-1 rounded-lg">
                👤 {lang === "hi" ? "मोड" : "Mode"}: <b>{t.citizenSafeView}</b>
              </span>
            ) : (
              <span className="text-slate-400">
                🛡️ {lang === "hi" ? "सक्रिय डेक" : "Active Deck"}: <b className="text-sky-400 uppercase">{activeTab}</b>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Tab Panel Content */}
        <div className="transition-opacity duration-200">
          {activeTab === "roads" && <RoadStatusPanel lang={lang} />}
          {activeTab === "weather" && <WeatherForecastWidget lang={lang} />}
          {activeTab === "live" && <LiveTelemetryExplorer lang={lang} />}
          {activeTab === "priorities" && <ResponsePrioritizationList lang={lang} />}
          {activeTab === "history" && <HistoricalTrendsChart lang={lang} />}
          {activeTab === "review" && (
            <OfficerReviewPanel
              lang={lang}
              reports={citizenReports}
              onVerifyReport={handleVerifyReport}
              onLocateOnMap={handleLocateOnMap}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              currentOfficer={currentOfficer}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onLogoutOfficer={() => setCurrentOfficer(null)}
            />
          )}
        </div>
      </section>

      {/* Citizen Hazard Photo/Video Report Modal Popup */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleNewReport}
        lang={lang}
      />

      {/* Officer Login Modal Popup */}
      <OfficerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(officer) => setCurrentOfficer(officer)}
        lang={lang}
      />

      {/* Official Government SitRep Briefing Modal Popup */}
      <SitRepModal
        isOpen={isSitRepModalOpen}
        onClose={() => setIsSitRepModalOpen(false)}
        lang={lang}
      />

      {/* High-Quality Mission Control Footer */}
      <footer className="py-4 border-t border-slate-800/90 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
        <p>
          Smart India Hackathon 2026 Prototype &bull; Ministry of Development of North Eastern Region (MDoNER) &bull; NDMA
        </p>
        <p className="font-mono text-[11px] text-slate-400">
          FastAPI + PostGIS + XGBoost/PyTorch + Next.js + Esri Dark Gray GIS Engine &bull; Offline PWA Enabled
        </p>
      </footer>
    </main>
  );
}
