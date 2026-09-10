"use client";

import React from "react";
import { Route, AlertOctagon, CheckCircle, Clock, ArrowRight, Home, Users, AlertTriangle } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface RoadStatusPanelProps {
  lang: Language;
}

interface RoadCorridor {
  id: string;
  highway: string;
  section: string;
  status: "BLOCKED" | "HIGH_RISK_ONE_WAY" | "CAUTION" | "OPERATIONAL";
  cause: string;
  detour: string;
  eta: string;
  villagesIsolated: number;
  isolatedVillages: string[];
  populationAffected: string;
  statusColor: string;
}

const roadCorridors: RoadCorridor[] = [
  {
    id: "ROAD-SK-01",
    highway: "NH-10 (Sikkim Lifeline)",
    section: "Sevoke to Teesta Bazaar (Km 29)",
    status: "BLOCKED",
    cause: "Debris Avalanche & Severe Embankment Undermining",
    detour: "Divert via Panbu - Mungpoo - Jorethang link road (Light Vehicles Only).",
    eta: "6 Hours",
    villagesIsolated: 5,
    isolatedVillages: ["Melli Flank", "Teesta Bazaar", "29th Mile", "Kalijhora", "Singtam Lower Pocket"],
    populationAffected: "18,400 Residents",
    statusColor: "text-red-400 bg-red-500/10 border-red-500/30"
  },
  {
    id: "ROAD-SK-02",
    highway: "NH-10 (Singtam Sector)",
    section: "Singtam to Gangtok Corridor",
    status: "HIGH_RISK_ONE_WAY",
    cause: "Active Slope Creep & Intermittent Rockfall",
    detour: "Police convoy escort in effect. Heavy vehicles prohibited.",
    eta: "2 Hours",
    villagesIsolated: 2,
    isolatedVillages: ["Ranipool Outskirts", "Tumin Valley Hamlets"],
    populationAffected: "6,200 Residents",
    statusColor: "text-orange-400 bg-orange-500/10 border-orange-500/30"
  },
  {
    id: "ROAD-ML-03",
    highway: "SH-5 (Shillong-Cherrapunji)",
    section: "Mawkdok Dympep Bridge Section",
    status: "CAUTION",
    cause: "Severe Waterlogging & Mud Accumulation",
    detour: "Speed limit 30 km/h enforced. Watch for sudden rock washouts.",
    eta: "Clear",
    villagesIsolated: 1,
    isolatedVillages: ["Dympep Village Cluster"],
    populationAffected: "1,850 Residents",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  {
    id: "ROAD-AS-04",
    highway: "NH-6 (Assam-Meghalaya Arterial)",
    section: "Nongpoh to Umiam Lake Sector",
    status: "OPERATIONAL",
    cause: "Normal flow under continuous telemetry monitoring",
    detour: "No detour required. Green corridor open for relief supply convoys.",
    eta: "Clear",
    villagesIsolated: 0,
    isolatedVillages: [],
    populationAffected: "0 (Direct Access)",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  }
];

export const RoadStatusPanel: React.FC<RoadStatusPanelProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1322] border border-slate-800/90 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-800/90 gap-2">
        <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
          <Route className="w-5 h-5" />
          <span className="uppercase tracking-wide">{t.roadStatusTitle}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-slate-900 text-slate-400 px-2.5 py-1 rounded-xl border border-slate-800 font-mono text-[11px]">
            {t.broTrafficFeed}
          </span>
          <span className="text-xs bg-rose-500/15 text-rose-300 px-2.5 py-0.5 rounded-lg border border-rose-500/35 font-bold">
            {t.blockedCorridorsCount}
          </span>
        </div>
      </div>

      {/* Lifeline Logistics & Critical Supplies Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#080d1a] border border-slate-800 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400">{t.strandedTrucks}</span>
          <p className="text-sm font-black text-amber-400 font-mono tabular-nums">142 {lang === "hi" ? "वाहन" : "Vehicles"}</p>
          <span className="text-[10px] text-slate-500">{lang === "hi" ? "सेवोक चेकपोस्ट पर रुके वाहन" : "Staged at Sevoke Checkpost"}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400">{t.medicalOxygenConvoys}</span>
          <p className="text-sm font-black text-emerald-400 font-mono">{lang === "hi" ? "लावा होकर डायवर्ट" : "Diverted via Lava"}</p>
          <span className="text-[10px] text-emerald-400/80">{lang === "hi" ? "ग्रीन कॉरिडोर सक्रिय" : "Green Corridor Active"}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400">{t.civilianFuelReserves}</span>
          <p className="text-sm font-black text-white font-mono tabular-nums">94 {lang === "hi" ? "घंटे" : "Hours"}</p>
          <span className="text-[10px] text-slate-500">{lang === "hi" ? "गंगटोक आईओसीएल बफर" : "Gangtok IOCL Depot Buffer"}</span>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400">{t.broEarthmovers}</span>
          <p className="text-sm font-black text-sky-400 font-mono tabular-nums">4 JCB {lang === "hi" ? "तैनात" : "Deployed"}</p>
          <span className="text-[10px] text-sky-400/80">{lang === "hi" ? "किमी 29 कटाव स्थल पर" : "At Km 29 Breach Site"}</span>
        </div>
      </div>

      {/* Corridor Cards with Road-Isolation Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {roadCorridors.map((rc) => {
          const isBlocked = rc.status === "BLOCKED";
          const isHighRisk = rc.status === "HIGH_RISK_ONE_WAY";

          return (
            <div
              key={rc.id}
              className={`p-4 rounded-xl border space-y-3 transition-all duration-200 hover:border-slate-700 ${
                isBlocked
                  ? "bg-[#0d1424] border-slate-800 border-l-4 border-l-rose-500 shadow-md"
                  : isHighRisk
                  ? "bg-[#0d1424] border-slate-800 border-l-4 border-l-amber-500 shadow-md"
                  : "bg-[#0d1424] border-slate-800 border-l-4 border-l-emerald-500"
              }`}
            >
              {/* Title & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">{rc.highway}</h4>
                  <p className="text-xs text-slate-400">{rc.section}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 font-mono ${rc.statusColor}`}>
                  {rc.status === "BLOCKED"
                    ? (lang === "hi" ? "अवरुद्ध" : lang === "as" ? "বন্ধ" : "BLOCKED")
                    : rc.status === "HIGH_RISK_ONE_WAY"
                    ? (lang === "hi" ? "उच्च जोखिम (एकतरफा)" : lang === "as" ? "উচ্চ বিপদ" : "HIGH RISK ONE WAY")
                    : rc.status === "CAUTION"
                    ? (lang === "hi" ? "सावधानी" : lang === "as" ? "সতৰ্কতা" : "CAUTION")
                    : (lang === "hi" ? "चालू" : lang === "as" ? "চলাচলক্ষম" : "OPERATIONAL")}
                </span>
              </div>

              {/* Visual Corridor Milestone Schematic for Blocked or High Risk Road */}
              {isBlocked && (
                <div className="p-2.5 rounded-lg bg-[#080d1a] border border-slate-800/80 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>{lang === "hi" ? "कॉरिडोर मील का पत्थर शृंखला:" : "Corridor Milestone Chain:"}</span>
                    <span className="text-rose-400 font-bold">{lang === "hi" ? "किमी 29 पर मार्ग टूटा" : "BREACH AT KM 29"}</span>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto py-1 text-slate-300">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Sevoke (Km 0)</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Kalijhora (Km 18)</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse">
                      ⛔ Km 29 ({lang === "hi" ? "अवरोध" : "BREACH"})
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Teesta (Km 34)</span>
                    <span className="text-slate-600">→</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Gangtok (Km 114)</span>
                  </div>
                </div>
              )}

              {/* Hazard Cause */}
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-slate-400 font-semibold">{t.hazardLabel}</span> {rc.cause}
              </p>

              {/* Detour Advisory */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex items-start gap-2 text-sky-300">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sky-400" />
                <span className="leading-relaxed">{rc.detour}</span>
              </div>

              {/* Road-Isolation Impact Card (PS Requirement 5) */}
              <div
                className={`p-2.5 rounded-lg border text-xs space-y-1.5 ${
                  isBlocked
                    ? "bg-rose-950/20 border-rose-500/25 text-rose-200"
                    : isHighRisk
                    ? "bg-amber-950/20 border-amber-500/25 text-amber-200"
                    : "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    <span>{t.villagesIsolated}: <b className="tabular-nums">{rc.villagesIsolated}</b></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{t.populationAffected}: <b>{rc.populationAffected}</b></span>
                  </div>
                </div>

                {rc.villagesIsolated > 0 && (
                  <p className="text-[11px] opacity-90 leading-tight">
                    <b>{lang === "hi" ? "संपर्क कटा क्षेत्र:" : "Cut-Off Communities:"}</b> {rc.isolatedVillages.join(", ")}
                  </p>
                )}
              </div>

              {/* Footer Meta */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {t.clearanceEtaLabel}{" "}
                  <b className="text-slate-200">{rc.eta}</b>
                </span>
                <span className="font-mono text-[10px] text-slate-500">{rc.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
