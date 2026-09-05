"use client";

import React from "react";
import { ClipboardCheck, Check, X, ShieldAlert, Clock, Image as ImageIcon, MapPin, Camera } from "lucide-react";
import { Language, translations } from "../../lib/i18n";
import { CitizenReportData } from "../reporting/CitizenReportModal";

interface OfficerReviewPanelProps {
  lang: Language;
  reports?: CitizenReportData[];
  onVerifyReport?: (id: number, status: "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM") => void;
  onLocateOnMap?: (report: CitizenReportData) => void;
  onOpenReportModal?: () => void;
}

export const OfficerReviewPanel: React.FC<OfficerReviewPanelProps> = ({
  lang,
  reports = [],
  onVerifyReport,
  onLocateOnMap,
  onOpenReportModal
}) => {
  const t = translations[lang];

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
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
              <span>{t.reportHazard || "Report Hazard (Photo)"}</span>
            </button>
          )}
          <span className="text-xs bg-slate-800 text-gray-400 px-2.5 py-1 rounded-xl border border-gray-700">
            Field Officer Cordon Action
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
              {/* Photo Thumbnail */}
              <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-700 bg-slate-950 group">
                <img
                  src={r.photoUrl}
                  alt={r.hazard}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[9px] text-rose-300 font-mono">
                  📸 PHOTO
                </div>
              </div>

              {/* Report Information */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-sky-400 font-semibold">#{r.id}</span>
                  <h4 className="text-sm font-bold text-white">{r.hazard}</h4>
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
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{r.desc}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                  <span>Reporter: <b>{r.reporter}</b> ({r.phone})</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" /> {r.time}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-sky-400">{r.lat.toFixed(2)}°N, {r.lon.toFixed(2)}°E</span>
                </div>
              </div>

              {/* Action Controls: Locate on Map & Verification Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                {/* Locate on Map Button */}
                {onLocateOnMap && (
                  <button
                    onClick={() => onLocateOnMap(r)}
                    className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-sky-500/30 transition"
                    title="Focus map on this location"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.locateOnMap || "Locate on Map"}</span>
                  </button>
                )}

                {/* Verification Actions */}
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
  );
};
