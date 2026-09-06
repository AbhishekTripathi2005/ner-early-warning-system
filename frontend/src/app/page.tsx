"use client";

import React, { useState, useEffect } from "react";
import { AlertBanner } from "../components/alerts/AlertBanner";
import { StatCards } from "../components/dashboard/StatCards";
import { HeatmapViewer } from "../components/gis/HeatmapViewer";
import { RoadStatusPanel } from "../components/dashboard/RoadStatusPanel";
import { WeatherForecastWidget } from "../components/dashboard/WeatherForecastWidget";
import { ResponsePrioritizationList } from "../components/dashboard/ResponsePrioritizationList";
import { HistoricalTrendsChart } from "../components/dashboard/HistoricalTrendsChart";
import { OfficerReviewPanel } from "../components/dashboard/OfficerReviewPanel";
import { OfficerLoginModal } from "../components/dashboard/OfficerLoginModal";
import { CitizenReportModal, CitizenReportData } from "../components/reporting/CitizenReportModal";
import { OfflineStatusBadge } from "../components/common/OfflineStatusBadge";
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
  Zap
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
    aiCorrelationNote: "Ground crack coordinates align with 89% slope susceptibility index & 195mm rainfall. InSAR creep detected within 500m."
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
    aiCorrelationNote: "Cloudburst zone radar echo 48 dBZ. Severe dynamic instability verified."
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
    aiCorrelationNote: "Sohra escarpment high rainfall zone (260.4mm/48h). Saturated shear failure confirmed by geological survey."
  }
];

export default function DashboardPage() {
  const [lang, setLang] = useState<Language>("en");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [currentOfficer, setCurrentOfficer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"roads" | "weather" | "priorities" | "history" | "review">("roads");
  const [currentTime, setCurrentTime] = useState("");
  const [citizenReports, setCitizenReports] = useState<CitizenReportData[]>(defaultCitizenReports);
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lon: number; id: number; _ts?: number } | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

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
    <main className="min-h-screen p-2.5 sm:p-5 md:p-6 max-w-[1640px] mx-auto space-y-4 sm:space-y-5 bg-[#090d16] text-slate-100 overflow-x-hidden w-full">
      {/* 0. Offline Field Mode Banner (Listens to network connectivity) */}
      <OfflineStatusBadge onSyncReports={handleSyncQueuedReports} />

      {/* 1. Command Center Top Header (Mobile 375px Optimized) */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 sm:p-5 rounded-2xl bg-[#0e1424] border border-gray-800/90 shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/40 text-sky-400 shadow-lg shadow-sky-500/10 shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base md:text-xl font-black tracking-tight text-white uppercase truncate">
                {t.title}
              </h1>
              <span className="text-[9px] sm:text-[10px] bg-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded-full border border-sky-500/40 font-bold shrink-0">
                SIH26001 &bull; MDoNER
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">{t.subtitle}</p>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          {/* Photo & Video Hazard Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black uppercase tracking-wider px-3 py-2 rounded-xl shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 animate-pulse"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.reportHazard}</span>
          </button>

          {/* Live IST Clock */}
          <div className="flex items-center space-x-1 text-xs bg-slate-900/90 border border-gray-700/80 px-2.5 py-2 rounded-xl text-gray-300 font-mono shadow-md">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px]">{currentTime || "LIVE IST"}</span>
          </div>

          {/* AI Engine Status (Dynamic Online vs Local Edge Cache State) */}
          {isOnline ? (
            <div className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-2 rounded-xl font-medium shadow-md">
              <Activity className="w-3.5 h-3.5 animate-pulse shrink-0" />
              <span className="hidden sm:inline font-semibold">{t.aiOnline}</span>
              <span className="sm:hidden font-mono font-bold text-[10px]">AI OK</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2.5 py-2 rounded-xl font-medium shadow-md animate-pulse">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline font-semibold font-mono">AI Engine: LOCAL (Edge Cache)</span>
              <span className="sm:hidden font-mono font-bold text-[10px]">AI LOCAL</span>
            </div>
          )}

          {/* 5-Language Multilingual Selector (EN, Hindi, Assamese, Bodo, Khasi) */}
          <div className="flex items-center bg-slate-900/90 border border-gray-700/80 rounded-xl p-0.5 text-xs shadow-md overflow-x-auto max-w-full">
            <Globe className="w-3.5 h-3.5 text-gray-400 ml-1.5 mr-1 shrink-0" />
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "en" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "hi" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang("as")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "as" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              অসমীয়া
            </button>
            <button
              onClick={() => setLang("brx")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "brx" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
              title="Bodo Language (बर' राव)"
            >
              बर'
            </button>
            <button
              onClick={() => setLang("kha")}
              className={`px-2 py-1 rounded-lg transition text-[11px] font-bold shrink-0 ${
                lang === "kha" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
              title="Khasi Language (Ka Ktien Khasi)"
            >
              Khasi
            </button>
          </div>

          {/* Officer Auth & Logout Controls */}
          {currentOfficer ? (
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl font-medium shadow-md">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-[11px] truncate max-w-[120px]">{currentOfficer.name}</span>
              </div>
              <button
                onClick={() => setCurrentOfficer(null)}
                className="flex items-center space-x-1 text-xs bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white font-bold px-2.5 py-1.5 rounded-xl border border-rose-500/30 transition shadow-md"
                title="Logout of Officer Mode (Return to Citizen View)"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-white font-bold px-3 py-2 rounded-xl border border-gray-700 transition shadow-md"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.officerLogin}</span>
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 p-2 rounded-xl border border-gray-700 transition shadow-md shrink-0"
            title="Refresh All Real-time Streams"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Active Emergency Dispatches Ticker with Voice Alert (Text-to-Speech) */}
      <AlertBanner lang={lang} />

      {/* 3. Real-Time Telemetry KPI Statistics with Strong Hierarchy */}
      <StatCards isOnline={isOnline} />

      {/* 4. Master Interactive GIS Map & Cherrapunji Detail Panel */}
      <section id="gis-map-section" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-300">
              {t.interactiveMapTitle}
            </h2>
          </div>
          <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono hidden sm:inline">
            Spatial Projection: EPSG:4326 &bull; Esri Dark Gray Canvas (Watermark-Free)
          </span>
        </div>
        <HeatmapViewer
          lang={lang}
          citizenReports={citizenReports}
          onVerifyReport={handleVerifyReport}
          focusTarget={focusTarget}
        />
      </section>

      {/* 5. Clear Bottom Navigation Tabs & Detailed Operations Deck */}
      <section className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-[#0e1424] border border-gray-800/90 space-y-4 shadow-2xl">
        {/* Modern Segmented Tab Bar with Horizontal Scroll for Mobile 375px */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-800/90">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-gray-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("roads")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 shrink-0 ${
                activeTab === "roads"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-500/40"
                  : "text-gray-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>{t.roadStatusTitle}</span>
            </button>

            <button
              onClick={() => setActiveTab("weather")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 shrink-0 ${
                activeTab === "weather"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-500/40"
                  : "text-gray-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>{t.weatherForecastTitle}</span>
            </button>

            <button
              onClick={() => setActiveTab("priorities")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 shrink-0 ${
                activeTab === "priorities"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-500/40"
                  : "text-gray-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t.prioritizationTitle}</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 shrink-0 ${
                activeTab === "history"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30 border border-sky-500/40"
                  : "text-gray-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.historicalTrendsTitle}</span>
            </button>

            <button
              onClick={() => setActiveTab("review")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all duration-200 shrink-0 ${
                activeTab === "review"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500/40"
                  : "text-rose-400 hover:text-rose-300 hover:bg-slate-900"
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{t.citizenReviewTitle}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 border border-rose-400/40 font-mono">
                {citizenReports.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">
            Active Module: <b className="text-sky-400 uppercase">{activeTab}</b>
          </span>
        </div>

        {/* Dynamic Tab Panel Content */}
        <div className="transition-all duration-300">
          {activeTab === "roads" && <RoadStatusPanel lang={lang} />}
          {activeTab === "weather" && <WeatherForecastWidget lang={lang} />}
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

      {/* High-Quality Mission Control Footer */}
      <footer className="py-4 border-t border-gray-800/90 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2 px-2">
        <p>
          Smart India Hackathon 2026 Prototype &bull; Ministry of Development of North Eastern Region (MDoNER)
        </p>
        <p className="font-mono text-[11px] text-gray-400">
          FastAPI + PostGIS + XGBoost/PyTorch + Next.js + Esri Dark Gray GIS Engine &bull; Offline PWA Enabled
        </p>
      </footer>
    </main>
  );
}
