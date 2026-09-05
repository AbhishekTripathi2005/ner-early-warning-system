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
  Award
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

export const OfficerReviewPanel: React.FC<OfficerReviewPanelProps> = ({
  lang,
  reports = [],
  onVerifyReport,
  onLocateOnMap,
  onOpenReportModal,
  currentOfficer
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
      {/* SECTION 1: Crowdsourced Citizen Incident Queue */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
          <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
            <ClipboardCheck className="w-5 h-5" />
            <span>{t.citizenReviewTitle}</span>
            <span className="text-xs bg-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded-full border border-sky-500/40 font-bold">
              {reports.length} Total
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenReportModal && (
              <button
                onClick={onOpenReportModal}
                className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{t.reportHazard}</span>
              </button>
            )}
            <span className="text-xs bg-slate-800 text-gray-400 px-2.5 py-1 rounded-xl border border-gray-700 font-mono text-[11px]">
              Ground Verification Queue
            </span>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-400 space-y-2">
              <Camera className="w-8 h-8 mx-auto text-gray-600" />
              <p className="text-xs">No citizen reports recorded yet.</p>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-gray-700 transition"
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
                    <h4 className="text-sm font-bold text-white truncate">{r.hazard}</h4>
                    <span className="text-xs text-gray-400">&bull; {r.location}</span>
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
                        : "Dismissed"}
                    </span>
                    {r.isOfflineQueued && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        Offline Queued
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{r.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                    <span>Reporter: <b>{r.reporter}</b> ({r.phone})</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" /> {r.time}
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

                  {r.status === "PENDING_REVIEW" && onVerifyReport && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onVerifyReport(r.id, "VERIFIED_TRUE_ALARM")}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-md shadow-emerald-600/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.verifyAction}</span>
                      </button>
                      <button
                        onClick={() => onVerifyReport(r.id, "DISMISSED_FALSE_ALARM")}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-gray-700 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t.dismissAction}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: CONTINUOUS LEARNING FEEDBACK (PS Requirement 6) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
            <Award className="w-5 h-5" />
            <span>Continuous Learning & Ground-Truth Feedback Panel</span>
          </div>
          <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 font-mono text-[11px]">
            AI Model Retraining Pipeline Hook
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Disaster management officers provide ground-truth validation labels for active early warning alerts. Every logged feedback entry is tagged with officer credentials and saved to the <code className="text-amber-300">feedback_log</code> table to retrain XGBoost/PyTorch susceptibility models.
        </p>

        {/* Feedback Submission Form */}
        <form onSubmit={handleFeedbackSubmit} className="p-4 rounded-xl bg-slate-900/90 border border-gray-800 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Target Alert Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Select Active Early Warning Alert
              </label>
              <select
                value={selectedAlertId}
                onChange={(e) => setSelectedAlertId(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {mockAlerts.map((a) => (
                  <option key={a.id} value={a.id}>
                    #{a.id} - {a.district} ({a.risk_level})
                  </option>
                ))}
                <option value={999}>#999 - Missed Event (Unflagged Landslide in Field)</option>
              </select>
            </div>

            {/* 2. Feedback Ground-Truth Classification */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Officer Ground-Truth Annotation
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: "CONFIRMED", label: "Confirmed (TP)", color: "bg-emerald-600 text-white border-emerald-400" },
                    { id: "FALSE_ALARM", label: "False Alarm (FP)", color: "bg-rose-600 text-white border-rose-400" },
                    { id: "MISSED_EVENT", label: "Missed Event (FN)", color: "bg-amber-600 text-white border-amber-400" }
                  ] as const
                ).map((opt) => (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setFeedbackType(opt.id)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition ${
                      feedbackType === opt.id
                        ? `${opt.color} shadow-sm`
                        : "bg-slate-950 border-gray-800 text-gray-400 hover:text-white"
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
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Observed Ground Rainfall (mm / 48h)
              </label>
              <input
                type="number"
                value={observedRain}
                onChange={(e) => setObservedRain(e.target.value)}
                placeholder="e.g. 265"
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* 4. Officer Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Field Verification Notes
              </label>
              <input
                type="text"
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="e.g. Tension cracks validated along road shoulder..."
                className="w-full bg-slate-950 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {feedbackSuccessMsg ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> {feedbackSuccessMsg}
              </span>
            ) : (
              <span className="text-[11px] text-gray-400 font-mono">
                Submitting as: <b className="text-white">{currentOfficer?.name || "Major Arvind Sharma (NDRF-NER-884)"}</b>
              </span>
            )}

            <button
              type="submit"
              disabled={isSubmittingFeedback}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingFeedback ? "Saving to Pipeline..." : "Log Ground Truth"}</span>
            </button>
          </div>
        </form>

        {/* Feedback Audit Trail History */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-300">
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>Recent Retraining Feedback Log (Audit Trail)</span>
          </div>

          <div className="space-y-2">
            {feedbackLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-gray-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-500 font-bold">{log.id}</span>
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
                  <p className="text-gray-400 text-[11px]">
                    {log.notes} &bull; Observed Rain: <b className="text-sky-300">{log.observedRainfall ? `${log.observedRainfall} mm` : "N/A"}</b>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400 shrink-0">
                  <span className="font-semibold text-gray-300">{log.officerName} ({log.officerBadge})</span>
                  <span>&bull;</span>
                  <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
