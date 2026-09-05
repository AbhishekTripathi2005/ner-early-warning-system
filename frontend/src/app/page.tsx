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
import { Language, translations } from "../lib/i18n";
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
  Layers
} from "lucide-react";

// Default authentic citizen reports across NER
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
    status: "PENDING_REVIEW",
    time: "25 mins ago",
    aiCorrelationScore: 0.92,
    aiCorrelationNote: "Ground crack coordinates align with 89% slope susceptibility index & 195mm rainfall. InSAR creep detected within 500m."
  },
  {
    id: 502,
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
    status: "VERIFIED_TRUE_ALARM",
    time: "2 hours ago",
    aiCorrelationScore: 0.94,
    aiCorrelationNote: "Sohra escarpment high rainfall zone (260.4mm/48h). Saturated shear failure confirmed by geological survey."
  },
  {
    id: 503,
    reporter: "Moa Longkumer",
    phone: "+91-94368-77889",
    location: "Diphu-Lumding Road (Km 18), Assam",
    district: "Karbi Anglong",
    state: "Assam",
    lat: 25.84,
    lon: 93.44,
    hazard: "Debris Mudflow Choking Highway",
    severity: "SEVERE",
    desc: "Sludge and saturated gravel sliding down embankment directly obstructing one traffic lane.",
    photoUrl: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=600&q=80",
    status: "PENDING_REVIEW",
    time: "10 mins ago",
    aiCorrelationScore: 0.96,
    aiCorrelationNote: "Pilot district radar detected 68mm/h cloudburst trigger. Mudflow risk reaches catastrophic state."
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

  const t = translations[lang];

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

  const handleVerifyReport = (id: number, status: "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM") => {
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
    <main className="min-h-screen p-3 sm:p-5 md:p-6 max-w-[1640px] mx-auto space-y-5 bg-[#090d16] text-slate-100">
      {/* 1. Command Center Top Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-gray-800/90 shadow-2xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/40 text-sky-400 shadow-lg shadow-sky-500/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white uppercase">
                {t.title}
              </h1>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono px-2.5 py-0.5 rounded-full border border-sky-500/40 font-bold">
                SIH26001 &bull; MDoNER
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{t.subtitle}</p>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Photo Hazard Report Button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all duration-200 animate-pulse"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.reportHazard || "Report Hazard (Photo)"}</span>
          </button>

          {/* Live IST Clock */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-900/90 border border-gray-700/80 px-3 py-2 rounded-xl text-gray-300 font-mono shadow-md">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentTime || "LIVE IST"}</span>
          </div>

          {/* AI Engine Status */}
          <div className="flex items-center space-x-2 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-xl font-medium shadow-md">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline font-semibold">{t.aiOnline}</span>
            <span className="sm:hidden font-mono font-bold">AI ONLINE</span>
          </div>

          {/* Trilingual Language Selector */}
          <div className="flex items-center bg-slate-900/90 border border-gray-700/80 rounded-xl p-0.5 text-xs shadow-md">
            <Globe className="w-3.5 h-3.5 text-gray-400 ml-2 mr-1" />
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-bold ${
                lang === "en" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-bold ${
                lang === "hi" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang("as")}
              className={`px-2.5 py-1 rounded-lg transition text-xs font-bold ${
                lang === "as" ? "bg-sky-600 text-white shadow-md shadow-sky-600/30" : "text-gray-400 hover:text-white"
              }`}
            >
              অসমীয়া
            </button>
          </div>

          {/* Officer Auth Button */}
          {currentOfficer ? (
            <div className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl font-medium shadow-md">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">{currentOfficer.name}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-white font-bold px-3.5 py-2 rounded-xl border border-gray-700 transition shadow-md"
            >
              {t.officerLogin}
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 px-2.5 py-2 rounded-xl border border-gray-700 transition shadow-md"
            title="Refresh All Real-time Streams"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Active Emergency Dispatches Ticker with Red Alert Glow */}
      <AlertBanner />

      {/* 3. Real-Time Telemetry KPI Statistics with Strong Hierarchy */}
      <StatCards />

      {/* 4. Master Interactive GIS Map & Cherrapunji Detail Panel */}
      <section id="gis-map-section" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-300">
              {t.interactiveMapTitle}
            </h2>
          </div>
          <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
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
      <section className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[#0e1424] border border-gray-800/90 space-y-5 shadow-2xl">
        {/* Modern Segmented Tab Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-gray-800/90">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-gray-800">
            <button
              onClick={() => setActiveTab("roads")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
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
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all duration-200 ${
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

          <span className="text-[11px] text-gray-500 font-mono">
            Active Module: <b className="text-sky-400 uppercase">{activeTab}</b>
          </span>
        </div>

        {/* Dynamic Tab Panel Content with Smooth Hover Polish */}
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
            />
          )}
        </div>
      </section>

      {/* Citizen Hazard Photo Report Modal Popup */}
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
          FastAPI + PostGIS + XGBoost/PyTorch + Next.js + Esri Dark Gray GIS Engine
        </p>
      </footer>
    </main>
  );
}
