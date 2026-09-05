"use client";

import React from "react";
import { Route, AlertOctagon, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface RoadStatusPanelProps {
  lang: Language;
}

const roadCorridors = [
  {
    id: "ROAD-SK-01",
    highway: "NH-10 (Sikkim Lifeline)",
    section: "Sevoke to Teesta Bazaar",
    status: "BLOCKED",
    cause: "Debris Avalanche at 29th Mile",
    detour: "Divert via Panbu - Mungpoo - Jorethang link road.",
    eta: "6 Hours",
    statusColor: "text-red-400 bg-red-500/10 border-red-500/30"
  },
  {
    id: "ROAD-SK-02",
    highway: "NH-10 (Singtam Sector)",
    section: "Singtam to Gangtok",
    status: "HIGH_RISK_ONE_WAY",
    cause: "Slope Creep & Minor Rockfall",
    detour: "Police convoy escort in effect.",
    eta: "2 Hours",
    statusColor: "text-orange-400 bg-orange-500/10 border-orange-500/30"
  },
  {
    id: "ROAD-ML-03",
    highway: "SH-5 (Shillong-Cherra)",
    section: "Mawkdok Dympep Bridge",
    status: "CAUTION",
    cause: "Waterlogging & Reduced Grip",
    detour: "Speed limit 30 km/h enforced.",
    eta: "Clear",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30"
  },
  {
    id: "ROAD-AS-04",
    highway: "NH-6 (Assam-Meghalaya)",
    section: "Nongpoh to Umiam Lake",
    status: "OPERATIONAL",
    cause: "Normal flow",
    detour: "No detour required.",
    eta: "Clear",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  }
];

export const RoadStatusPanel: React.FC<RoadStatusPanelProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
          <Route className="w-5 h-5" />
          <span>{t.roadStatusTitle}</span>
        </div>
        <span className="text-xs bg-slate-800 text-gray-400 px-2.5 py-0.5 rounded-full border border-gray-700">
          BRO / Traffic Police Live Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {roadCorridors.map((rc) => (
          <div
            key={rc.id}
            className="p-3.5 rounded-xl bg-slate-900/70 border border-gray-800 hover:border-gray-700 space-y-2.5 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{rc.highway}</h4>
                <p className="text-xs text-gray-400">{rc.section}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${rc.statusColor}`}>
                {rc.status.replace(/_/g, " ")}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              <span className="text-gray-500">Hazard:</span> {rc.cause}
            </p>

            <div className="p-2 rounded-lg bg-black/40 border border-gray-800 text-xs flex items-start gap-1.5 text-sky-300">
              <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-sky-400" />
              <span>{rc.detour}</span>
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Clearance ETA: <b className="text-gray-200">{rc.eta}</b>
              </span>
              <span className="font-mono text-[10px] text-gray-500">{rc.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
