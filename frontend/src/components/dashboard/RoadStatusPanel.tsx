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
    <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
          <Route className="w-5 h-5" />
          <span>{t.roadStatusTitle}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-slate-800 text-gray-400 px-2.5 py-1 rounded-xl border border-gray-700 font-mono text-[11px]">
            BRO / Traffic Police Live Feed
          </span>
          <span className="text-xs bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-lg border border-rose-500/30 font-bold">
            1 Blocked Corridor
          </span>
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
              className={`p-4 rounded-xl border hover:border-gray-700 space-y-3 transition ${
                isBlocked
                  ? "bg-gradient-to-br from-red-950/30 via-slate-900/80 to-slate-900 border-red-500/40 shadow-md shadow-red-950/20"
                  : isHighRisk
                  ? "bg-gradient-to-br from-orange-950/20 via-slate-900/80 to-slate-900 border-orange-500/40"
                  : "bg-slate-900/70 border-gray-800"
              }`}
            >
              {/* Title & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">{rc.highway}</h4>
                  <p className="text-xs text-gray-400">{rc.section}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${rc.statusColor}`}>
                  {rc.status.replace(/_/g, " ")}
                </span>
              </div>

              {/* Hazard Cause */}
              <p className="text-xs text-slate-300">
                <span className="text-gray-500 font-semibold">Hazard:</span> {rc.cause}
              </p>

              {/* Detour Advisory */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-gray-800 text-xs flex items-start gap-2 text-sky-300">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sky-400" />
                <span className="leading-relaxed">{rc.detour}</span>
              </div>

              {/* Road-Isolation Impact Card (PS Requirement 5) */}
              <div
                className={`p-2.5 rounded-lg border text-xs space-y-1.5 ${
                  isBlocked
                    ? "bg-red-950/30 border-red-500/30 text-red-200"
                    : isHighRisk
                    ? "bg-amber-950/25 border-amber-500/30 text-amber-200"
                    : "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    <span>Estimated Villages Cut Off: <b>{rc.villagesIsolated}</b></span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Affected: <b>{rc.populationAffected}</b></span>
                  </span>
                </div>

                {rc.villagesIsolated > 0 && (
                  <p className="text-[11px] opacity-90 leading-tight">
                    <b>Cut-Off Communities:</b> {rc.isolatedVillages.join(", ")}
                  </p>
                )}
              </div>

              {/* Footer Meta */}
              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-gray-800/80">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Clearance ETA:{" "}
                  <b className="text-gray-200">{rc.eta}</b>
                </span>
                <span className="font-mono text-[10px] text-gray-500">{rc.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
