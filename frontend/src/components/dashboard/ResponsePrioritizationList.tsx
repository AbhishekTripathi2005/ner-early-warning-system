"use client";

import React from "react";
import { AlertCircle, Users, Siren, Shield } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface ResponsePrioritizationListProps {
  lang: Language;
}

const priorities = [
  {
    rank: 1,
    zone: "Cherrapunji - Mawmluh Hamlets",
    district: "East Khasi Hills, Meghalaya",
    popAtRisk: "14,200",
    lsi: 0.94,
    level: "P1: IMMEDIATE EVACUATION",
    color: "bg-red-500/20 text-red-400 border-red-500/40",
    action: "Mobilize SDRF 1st Battalion; dispatch 8 evacuation buses to Polo Camp"
  },
  {
    rank: 2,
    zone: "Singtam River Flank Villages",
    district: "East Sikkim",
    popAtRisk: "8,900",
    lsi: 0.82,
    level: "P1: ACTIVE CREEP RESPONSE",
    color: "bg-red-500/20 text-red-400 border-red-500/40",
    action: "Enforce one-way transit; deploy heavy earthmovers on NH-10"
  },
  {
    rank: 3,
    zone: "Haflong Slopes Settlement",
    district: "Dima Hasao, Assam",
    popAtRisk: "6,400",
    lsi: 0.64,
    level: "P2: PREEMPTIVE STANDBY",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    action: "Inspect railway cutting toe; alert local village defense parties"
  }
];

export const ResponsePrioritizationList: React.FC<ResponsePrioritizationListProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
          <Siren className="w-5 h-5 animate-pulse" />
          <span>{t.prioritizationTitle}</span>
        </div>
        <span className="text-xs bg-rose-500/10 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30">
          AI Risk Score &bull; Census Weighted
        </span>
      </div>

      <div className="space-y-3">
        {priorities.map((p) => (
          <div
            key={p.rank}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
          >
            <div className="flex items-start space-x-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-black/60 border border-gray-700 text-xs font-black text-white shrink-0 mt-0.5">
                #{p.rank}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{p.zone}</h4>
                  <span className="text-xs text-gray-400">({p.district})</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <b>Action:</b> {p.action}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-3 text-xs shrink-0">
              <div className="flex items-center space-x-1.5 text-gray-300 bg-black/40 px-2.5 py-1 rounded-lg border border-gray-800">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Pop: <b>{p.popAtRisk}</b></span>
              </div>
              <span className={`px-2.5 py-1 rounded-lg font-bold border text-[11px] ${p.color}`}>
                {p.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
