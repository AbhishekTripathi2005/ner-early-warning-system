"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Check,
  X,
  ShieldAlert,
  Clock,
  Image as ImageIcon,
  MapPin,
  Camera,
  Video,
  Database,
  Send,
  AlertTriangle,
  History,
  Award,
  Lock,
  LogOut,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Language, translations } from "../../lib/i18n";
import { CitizenReportData } from "../reporting/CitizenReportModal";
import { mockAlerts, AlertItem } from "../alerts/AlertBanner";
import { offlineDb, OfflineFeedbackLog } from "../../lib/offlineDb";

interface OfficerReviewPanelProps {
  lang: Language;
  reports?: CitizenReportData[];
  onVerifyReport?: (id: number, status: "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM") => void;
  onLocateOnMap?: (report: CitizenReportData) => void;
  onOpenReportModal?: () => void;
  currentOfficer?: any;
  onOpenLoginModal?: () => void;
  onLogoutOfficer?: () => void;
}

const defaultFeedbackLogs: OfflineFeedbackLog[] = [
  {
    id: "FB-01",
    alertId: 101,
    alertTitle: "RED ALERT: Imminent Slope Failure Threat in East Khasi Hills",
    feedbackType: "CONFIRMED",
    officerName: "Major Arvind Sharma",
    officerBadge: "NDRF-NER-884",
    notes: "Confirmed 6m toe blowout along NH-206. Evacuation order validated.",
    observedRainfall: 285.5,
    timestamp: Date.now() - 3600000,
    synced: true
  },
  {
    id: "FB-02",
    alertId: 102,
    alertTitle: "ORANGE ALERT: Highway Toe Erosion & InSAR Creep",
    feedbackType: "CONFIRMED",
    officerName: "Inspector T. Lepcha",
    officerBadge: "SDRF-SK-102",
    notes: "Active riverbank scouring observed at 29th Mile. One-way transit enforced.",
    observedRainfall: 142.0,
    timestamp: Date.now() - 7200000,
    synced: true
  }
];

function getLocalizedReportInfo(r: CitizenReportData, lang: Language) {
  if (lang === "hi") {
    let hazard = r.hazard;
    let desc = r.desc;
    let location = r.location;
    if (r.id === 501 || r.hazard.includes("Fissure") || r.hazard.includes("Creep")) {
      hazard = "पहाड़ी दरार व विस्थापन";
      desc = "सामुदायिक स्कूल के पीछे सीढ़ीदार ढलान पर 5 इंच चौड़ी दरार देखी गई।";
      location = "सिंगतम क्षेत्र, पूर्वी सिक्किम";
    } else if (r.id === 502 || r.hazard.includes("Mudflow") || r.hazard.includes("Gravel")) {
      hazard = "सड़क पर सक्रिय मलबे का बहाव";
      desc = "सड़क पर लगातार गिरते मलबे और कीचड़ का 12 सेकंड का वीडियो।";
      location = "हाफलॉन्ग पहाड़ी कटिंग, दीमा हसाओ";
    } else if (r.id === 503 || r.hazard.includes("Bulging")) {
      hazard = "सुरक्षा दीवार का बाहर झुकना";
      desc = "कंक्रीट सुरक्षा दीवार बाहर झुक रही है और पहाड़ी से कीचड़युक्त पानी बह रहा है।";
      location = "चेरापूंजी ढलान, मेघालय";
    }
    return {
      hazard,
      desc,
      location,
      time: r.time.replace("mins ago", "मिनट पहले").replace("hours ago", "घंटे पहले").replace("Synced just now", "अभी सिंक हुआ"),
      reporterLabel: "रिपोर्टर"
    };
  }
  if (lang === "as") {
    let hazard = r.hazard;
    let desc = r.desc;
    let location = r.location;
    if (r.id === 501 || r.hazard.includes("Fissure") || r.hazard.includes("Creep")) {
      hazard = "পাহাৰত নতুন ফাট";
      desc = "বিদ্যালয়ৰ পিছফালে ৫ ইঞ্চি বহল ভূমিৰ ফাট দেখা গৈছে।";
      location = "ছিংটাম অঞ্চল, পূব ছিকিম";
    } else if (r.id === 502 || r.hazard.includes("Mudflow") || r.hazard.includes("Gravel")) {
      hazard = "ঘাইপথত বোকা আৰু শিলৰ স্খলন";
      desc = "ঘাইপথত বোকা আৰু শিল বাগৰি পৰাৰ ১২ ছেকেণ্ডৰ ভিডিঅ'।";
      location = "হাফলং পাহাৰীয়া অংশ, ডিমা হাছাও";
    } else if (r.id === 503 || r.hazard.includes("Bulging")) {
      hazard = "সুৰক্ষা দেৱাল ফুলি উঠা";
      desc = "কংক্ৰিটৰ সুৰক্ষা দেৱাল ফুলি উঠিছে আৰু পানী ওলাইছে।";
      location = "চেৰাপুঞ্জী এস্কাৰ্পমেণ্ট, মেঘালয়";
    }
    return {
      hazard,
      desc,
      location,
      time: r.time.replace("mins ago", "মিনিট পূৰ্বে").replace("hours ago", "ঘণ্টা পূৰ্বে").replace("Synced just now", "এইমাত্ৰ চিন্ক হৈছে"),
      reporterLabel: "প্ৰতিবেদনকাৰী"
    };
  }
  return {
    hazard: r.hazard,
    desc: r.desc,
    location: r.location,
    time: r.time,
    reporterLabel: "Reporter"
  };
}

export const OfficerReviewPanel: React.FC<OfficerReviewPanelProps> = ({
  lang,
  reports = [],
  onVerifyReport,
  onLocateOnMap,
  onOpenReportModal,
  currentOfficer,
  onOpenLoginModal,
  onLogoutOfficer
}) => {
  const t = translations[lang] || translations.en;

  // Feedback form state
  const [selectedAlertId, setSelectedAlertId] = useState<number>(101);
  const [feedbackType, setFeedbackType] = useState<"CONFIRMED" | "FALSE_ALARM" | "MISSED_EVENT">("CONFIRMED");
  const [observedRain, setObservedRain] = useState<string>("265");
  const [officerNotes, setOfficerNotes] = useState<string>("");
  const [feedbackLogs, setFeedbackLogs] = useState<OfflineFeedbackLog[]>(defaultFeedbackLogs);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  // Load existing feedback logs from IndexedDB if present
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const storedLogs = await offlineDb.getFeedbackLogs();
        if (storedLogs && storedLogs.length > 0) {
          setFeedbackLogs((prev) => {
            const ids = new Set(storedLogs.map((l) => l.id));
            const filteredPrev = prev.filter((l) => !ids.has(l.id));
            return [...storedLogs, ...filteredPrev];
          });
        }
      } catch (e) {
        // Fallback to defaults
      }
    };
    loadLogs();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);

    const alertItem = mockAlerts.find((a) => a.id === selectedAlertId);
    const alertTitle = alertItem ? alertItem.title : "Unflagged Missed Event Incident";
    const officerName = currentOfficer?.name || "Field Disaster Commander";
    const officerBadge = currentOfficer?.badge || "NDRF-NER-884";

    const newLog: OfflineFeedbackLog = {
      id: `FB-${Date.now().toString().slice(-4)}`,
      alertId: selectedAlertId,
      alertTitle: alertTitle,
      feedbackType: feedbackType,
      officerName: officerName,
      officerBadge: officerBadge,
      notes: officerNotes.trim() || `Officer verified ground condition as ${feedbackType}.`,
      observedRainfall: parseFloat(observedRain) || undefined,
      timestamp: Date.now(),
      synced: false
    };

    // Save to IndexedDB
    try {
      await offlineDb.saveFeedback(newLog);
    } catch (err) {
      console.warn("IndexedDB save feedback:", err);
    }

    // Try posting to FastAPI backend
    try {
      if (typeof window !== "undefined" && navigator.onLine) {
        await fetch("http://127.0.0.1:8000/api/v1/alerts/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alert_id: selectedAlertId,
            alert_title: alertTitle,
            feedback_type: feedbackType,
            officer_name: officerName,
            officer_badge: officerBadge,
            observed_rainfall_mm: parseFloat(observedRain) || null,
            notes: officerNotes
          })
        });
        newLog.synced = true;
      }
    } catch (err) {
      // Backend not running or offline, keep local copy
    }

    setFeedbackLogs((prev) => [newLog, ...prev]);
    setIsSubmittingFeedback(false);
    setOfficerNotes("");
    setFeedbackSuccessMsg(`Logged: Alert marked as ${feedbackType}. Pipeline updated.`);
    setTimeout(() => setFeedbackSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* View-Only Demo Mode Safeguard Banner (Audit Patch 5) */}
      {currentOfficer?.isViewOnlyDemo && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-300 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <b>VIEW-ONLY DEMO MODE:</b> Backend command server is offline or unreachable. Sensitive write-actions (retraining loop submission, alert dispatch, report verification) are locked in read-only mode to prevent corrupting logs.
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold shrink-0">
            Read-Only Demo
          </span>
        </div>
      )}

      {/* SECTION 1: Crowdsourced Citizen Incident Queue */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1322] border border-slate-800/90 space-y-4 shadow-xl">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800/90 gap-2">
          <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
            <ClipboardCheck className="w-5 h-5" />
            <span className="uppercase tracking-wide">{t.citizenReviewTitle}</span>
            <span className="text-xs bg-sky-500/15 text-sky-300 font-mono px-2 py-0.5 rounded-full border border-sky-500/35 font-bold tabular-nums">
              {reports.length} Total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t.reportHazard}</span>
              </button>
            )}

            {currentOfficer ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs text-emerald-300 font-bold truncate max-w-[120px]">
                  {currentOfficer.name}
                </span>
                <span className="text-[10px] text-emerald-400/80 font-mono hidden sm:inline">
                  ({currentOfficer.badge || "Verified"})
                </span>
                {onLogoutOfficer && (
                  <button
                    onClick={onLogoutOfficer}
                    className="ml-1 px-2 py-0.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-sm"
                    title="Log out of Officer Mode"
                  >
                    <LogOut className="w-3 h-3 text-rose-400" />
                    <span>{lang === "hi" ? "लॉगआउट" : lang === "as" ? "প্ৰস্থান" : "Logout"}</span>
                  </button>
                )}
              </div>
            ) : (
              onOpenLoginModal && (
                <button
                  onClick={onOpenLoginModal}
                  className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  title="Authenticate with official badge to verify citizen reports"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.officerLoginToVerify}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <Camera className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No citizen reports recorded yet.</p>
            </div>
          ) : (
            reports.map((r) => {
              const locR = getLocalizedReportInfo(r, lang);
              return (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                {/* Media Thumbnail (Photo or Video Player) */}
                <div className="relative w-full md:w-36 h-28 rounded-lg overflow-hidden shrink-0 border border-gray-700 bg-slate-950 group">
                  {r.mediaType === "video" ? (
                    <video
                      src={r.photoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80"
                    />
                  ) : (
                    <img
                      src={r.photoUrl}
                      alt={r.hazard}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                  <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur px-1.5 py-0.5 rounded text-[9px] text-rose-300 font-mono flex items-center gap-1 pointer-events-none">
                    {r.mediaType === "video" ? (
                      <>
                        <Video className="w-3 h-3 text-amber-400" />
                        <span>VIDEO ({r.durationSeconds || 12}s)</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-3 h-3 text-sky-400" />
                        <span>PHOTO</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Report Information */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-sky-400 font-semibold">#{r.id}</span>
                    <h4 className="text-sm font-bold text-white truncate">{locR.hazard}</h4>
                    <span className="text-xs text-gray-400">&bull; {locR.location}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        r.status === "VERIFIED_TRUE_ALARM"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : r.status === "DISMISSED_FALSE_ALARM"
                          ? "bg-gray-700/40 text-gray-400 border border-gray-600"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                      }`}
                    >
                      {r.status === "PENDING_REVIEW"
                        ? t.pendingReview
                        : r.status === "VERIFIED_TRUE_ALARM"
                        ? t.verifiedAlarm
                        : (lang === "hi" ? "खारिज" : lang === "as" ? "বাতিল" : "Dismissed")}
                    </span>
                    {r.isOfflineQueued && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        {lang === "hi" ? "ऑफ़लाइन कतारबद्ध" : "Offline Queued"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{locR.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                    <span>{locR.reporterLabel}: <b>{r.reporter}</b> ({r.phone})</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" /> {locR.time}
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono text-sky-400">{r.lat.toFixed(4)}°N, {r.lon.toFixed(4)}°E</span>
                  </div>
                </div>

                {/* Action Controls: Locate on Map & Verification Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                  {onLocateOnMap && (
                    <button
                      onClick={() => onLocateOnMap(r)}
                      className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-sky-500/30 transition"
                      title="Focus map on this location"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t.locateOnMap}</span>
                    </button>
                  )}

                  {r.status === "PENDING_REVIEW" && (
                    currentOfficer && onVerifyReport ? (
                      currentOfficer.isViewOnlyDemo ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                            Verification Locked (View-Only Mode)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onVerifyReport(r.id, "VERIFIED_TRUE_ALARM")}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-md shadow-emerald-600/20"
                            title={`Authorized as ${currentOfficer.name} (${currentOfficer.badge || "Officer"})`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.verifyAction}</span>
                          </button>
                          <button
                            onClick={() => onVerifyReport(r.id, "DISMISSED_FALSE_ALARM")}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-gray-700 transition"
                            title="Dismiss as False Alarm or Spam"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{t.dismissAction}</span>
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={onOpenLoginModal}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 transition shadow-sm group"
                        title="Only authorized disaster management officers can verify reports"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                        <span>{t.officerLoginToVerify}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>

      {/* SECTION 2: CONTINUOUS LEARNING FEEDBACK (PS Requirement 6) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1322] border border-slate-800/90 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800/90 gap-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span className="uppercase tracking-wide">{t.continuousLearningTitle}</span>
          </div>
          <span className="text-xs bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 font-mono text-[11px]">
            {t.retrainingPipelineHook}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {lang === "hi" 
            ? "आपदा प्रबंधन अधिकारी सक्रिय पूर्व चेतावनियों के लिए जमीनी सत्यापन लेबल प्रदान करते हैं। यह प्रतिक्रिया सीधे AI मॉडल को पुनः प्रशिक्षित करने के लिए सहेजी जाती है।" 
            : "Disaster management officers provide ground-truth validation labels for active early warning alerts. Every logged feedback entry is tagged with officer credentials and saved to the feedback_log table to retrain XGBoost/PyTorch susceptibility models."}
        </p>

        {/* Feedback Submission Form */}
        <form onSubmit={handleFeedbackSubmit} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Target Alert Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t.selectActiveAlert}
              </label>
              <select
                value={selectedAlertId}
                onChange={(e) => setSelectedAlertId(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {mockAlerts.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} - {lang === "hi" ? (a.district_hi || a.district) : a.district} ({a.risk_level})
                  </option>
                ))}
                <option value={999}>#999 - {lang === "hi" ? "छूटी घटना (मैदानी अचिह्नित भूस्खलन)" : "Missed Event (Unflagged Landslide in Field)"}</option>
              </select>
            </div>

            {/* 2. Feedback Ground-Truth Classification */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t.officerAnnotation}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "CONFIRMED", label: t.confirmedTP, color: "bg-emerald-600 text-white border-emerald-400" },
                    { id: "FALSE_ALARM", label: t.falseAlarmFP, color: "bg-rose-600 text-white border-rose-400" },
                    { id: "MISSED_EVENT", label: t.missedEventFN, color: "bg-amber-600 text-white border-amber-400" }
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setFeedbackType(opt.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                      feedbackType === opt.id
                        ? `${opt.color} shadow-sm`
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 3. Observed Rainfall */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t.observedRainfall}
              </label>
              <input
                type="number"
                value={observedRain}
                onChange={(e) => setObservedRain(e.target.value)}
                placeholder="e.g. 265"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 4. Officer Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t.fieldVerificationNotes}
              </label>
              <input
                type="text"
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder={lang === "hi" ? "उदा. सड़क किनारे तनाव दरारें सत्यापित..." : "e.g. Tension cracks validated along road shoulder..."}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {feedbackSuccessMsg ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> {feedbackSuccessMsg}
              </span>
            ) : (
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                {currentOfficer ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.signingAs}: <b className="text-emerald-300">{currentOfficer.name}</b> ({currentOfficer.badge || "Officer"})</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.publicViewLoginPrompt}</span>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingFeedback || currentOfficer?.isViewOnlyDemo}
              className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition ${
                currentOfficer?.isViewOnlyDemo
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950"
              }`}
              title={currentOfficer?.isViewOnlyDemo ? "Write actions disabled in View-Only Demo Mode" : undefined}
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {currentOfficer?.isViewOnlyDemo
                  ? (lang === "hi" ? "केवल-दर्शन मोड" : "Write Locked (View-Only)")
                  : isSubmittingFeedback
                  ? (lang === "hi" ? "सहेजा जा रहा है..." : "Saving to Pipeline...")
                  : t.submitFeedback}
              </span>
            </button>
          </div>
        </form>

        {/* Feedback Audit Trail History */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300">
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span className="uppercase tracking-wide">Recent Retraining Feedback Log (Audit Trail)</span>
          </div>

          <div className="space-y-2">
            {feedbackLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold">{log.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.feedbackType === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : log.feedbackType === "FALSE_ALARM"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {log.feedbackType}
                    </span>
                    <b className="text-white truncate">{log.alertTitle}</b>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {log.notes} &bull; Observed Rain: <b className="text-sky-300 tabular-nums">{log.observedRainfall ? `${log.observedRainfall} mm` : "N/A"}</b>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                  <span className="font-semibold text-slate-300">{log.officerName} ({log.officerBadge})</span>
                  <span>&bull;</span>
                  <span className="font-mono tabular-nums">{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
