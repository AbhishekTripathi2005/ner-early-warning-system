"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Users,
  Siren,
  Shield,
  ArrowUpDown,
  Home,
  Truck,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface ResponsePrioritizationListProps {
  lang: Language;
}

interface PrioritySector {
  rank: number;
  sectorId: string;
  zone: string;
  district: string;
  state: string;
  priorityLevel: number; // 1, 2, 3
  villagesIsolated: number;
  isolatedVillageNames: string[];
  popAtRisk: number;
  lsi: number;
  leadTime: string;
  urgencyLabel: string;
  urgencyColor: string;
  action: string;
  battalionAssigned: string;
  evacuationBuses: number;
  routeStatus: string;
}

const initialSectors: PrioritySector[] = [
  {
    rank: 1,
    sectorId: "Sector 1",
    zone: "Cherrapunji - Mawmluh Escarpment",
    district: "East Khasi Hills",
    state: "Meghalaya",
    priorityLevel: 1,
    villagesIsolated: 4,
    isolatedVillageNames: ["Mawmluh", "Mawkdok", "Laitryngew", "Sohra Outpost"],
    popAtRisk: 14200,
    lsi: 0.95,
    leadTime: "3.5 Hours",
    urgencyLabel: "P1: IMMEDIATE EVACUATION",
    urgencyColor: "bg-red-500/20 text-red-300 border-red-500/40",
    action: "Mobilize SDRF 1st Battalion; dispatch 8 evacuation buses to Polo Ground Relief Camp.",
    battalionAssigned: "SDRF 1st Bn + Local Police",
    evacuationBuses: 8,
    routeStatus: "Secondary Link via Tyrna (4x4 Convoys Only)"
  },
  {
    rank: 2,
    sectorId: "Sector 2",
    zone: "Singtam River Flank Settlements",
    district: "East Sikkim",
    state: "Sikkim",
    priorityLevel: 1,
    villagesIsolated: 2,
    isolatedVillageNames: ["29th Mile Hamlet", "Teesta Bazaar Flank"],
    popAtRisk: 8900,
    lsi: 0.84,
    leadTime: "5.0 Hours",
    urgencyLabel: "P1: ACTIVE CREEP RESPONSE",
    urgencyColor: "bg-red-500/20 text-red-300 border-red-500/40",
    action: "Deploy heavy earthmovers on NH-10; establish riverbank flood & debris sirens.",
    battalionAssigned: "BRO Task Force 44 + NDRF 2nd Bn",
    evacuationBuses: 5,
    routeStatus: "Divert via Panbu-Algarah Alternative Road"
  },
  {
    rank: 3,
    sectorId: "Sector 3",
    zone: "Haflong Slopes Railway Colony",
    district: "Dima Hasao",
    state: "Assam",
    priorityLevel: 2,
    villagesIsolated: 1,
    isolatedVillageNames: ["Upper Haflong Railway Ridge"],
    popAtRisk: 6400,
    lsi: 0.68,
    leadTime: "8.5 Hours",
    urgencyLabel: "P2: PREEMPTIVE STANDBY",
    urgencyColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    action: "Inspect railway cutting toe; alert local Village Defense Parties; prep community shelters.",
    battalionAssigned: "Assam Rifles Support Platoon",
    evacuationBuses: 3,
    routeStatus: "Haflong-Lumding Road Open with Speed Advisory"
  },
  {
    rank: 4,
    sectorId: "Sector 4",
    zone: "Nongpoh Valley Corridor",
    district: "Ri-Bhoi",
    state: "Meghalaya",
    priorityLevel: 3,
    villagesIsolated: 0,
    isolatedVillageNames: [],
    popAtRisk: 2100,
    lsi: 0.42,
    leadTime: "18.0 Hours",
    urgencyLabel: "P3: MONITORING WATCH",
    urgencyColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    action: "Routine radar scan & drone clearance; road drainage inspection.",
    battalionAssigned: "District Highway Patrol",
    evacuationBuses: 1,
    routeStatus: "NH-6 Fully Operational"
  }
];

export const ResponsePrioritizationList: React.FC<ResponsePrioritizationListProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [sortBy, setSortBy] = useState<"RANK" | "POPULATION" | "ISOLATION" | "LSI">("RANK");

  const sortedSectors = [...initialSectors].sort((a, b) => {
    if (sortBy === "POPULATION") return b.popAtRisk - a.popAtRisk;
    if (sortBy === "ISOLATION") return b.villagesIsolated - a.villagesIsolated;
    if (sortBy === "LSI") return b.lsi - a.lsi;
    return a.rank - b.rank;
  });

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
      {/* Header with Sorting Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-800 gap-2.5">
        <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
          <Siren className="w-5 h-5 animate-pulse" />
          <span>{t.prioritizationTitle}</span>
        </div>

        {/* Multi-Factor Sorting Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-gray-400 text-[11px] mr-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Sort By:
          </span>
          <button
            onClick={() => setSortBy("RANK")}
            className={`px-2.5 py-1 rounded-lg border transition text-[11px] font-bold ${
              sortBy === "RANK"
                ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                : "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Priority Rank
          </button>
          <button
            onClick={() => setSortBy("ISOLATION")}
            className={`px-2.5 py-1 rounded-lg border transition text-[11px] font-bold ${
              sortBy === "ISOLATION"
                ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                : "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Villages Cut Off
          </button>
          <button
            onClick={() => setSortBy("POPULATION")}
            className={`px-2.5 py-1 rounded-lg border transition text-[11px] font-bold ${
              sortBy === "POPULATION"
                ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                : "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Population at Risk
          </button>
          <button
            onClick={() => setSortBy("LSI")}
            className={`px-2.5 py-1 rounded-lg border transition text-[11px] font-bold ${
              sortBy === "LSI"
                ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                : "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            AI LSI Score
          </button>
        </div>
      </div>

      {/* Ranked List formatted strictly per PS requirement:
          "Sector X: Priority 1 — 3 villages isolated, 450 population affected" */}
      <div className="space-y-3">
        {sortedSectors.map((sector) => (
          <div
            key={sector.sectorId}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              sector.priorityLevel === 1
                ? "bg-gradient-to-r from-red-950/40 via-slate-900/90 to-slate-900 border-red-500/40 shadow-md shadow-red-950/20"
                : sector.priorityLevel === 2
                ? "bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-900 border-amber-500/30"
                : "bg-slate-900/70 border-gray-800"
            }`}
          >
            {/* Main Required Format Line */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-800/80">
              <div className="flex items-start sm:items-center space-x-3">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-black shrink-0 ${
                    sector.priorityLevel === 1
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : sector.priorityLevel === 2
                      ? "bg-amber-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  #{sector.rank}
                </span>

                <div>
                  {/* Strict Format Heading */}
                  <h4 className="text-sm font-black text-white tracking-wide">
                    <span className="text-rose-400">{sector.sectorId}</span>: Priority {sector.priorityLevel} —{" "}
                    <span className="text-amber-300">
                      {sector.villagesIsolated} {sector.villagesIsolated === 1 ? "village" : "villages"} isolated
                    </span>
                    ,{" "}
                    <span className="text-sky-300">
                      {sector.popAtRisk.toLocaleString()} population affected
                    </span>
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sector.zone} &bull; <b className="text-gray-300">{sector.district}, {sector.state}</b>
                  </p>
                </div>
              </div>

              {/* Status and Action Badges */}
              <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${sector.urgencyColor}`}>
                  {sector.urgencyLabel}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950 border border-gray-700 text-sky-400">
                  LSI: {sector.lsi.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Tactical Incident Details */}
            <div className="pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* Action Directive */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-gray-800/80 space-y-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-rose-400" /> Action Directive
                </span>
                <p className="text-slate-200 leading-relaxed">{sector.action}</p>
              </div>

              {/* Isolated Villages List */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-gray-800/80 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Home className="w-3.5 h-3.5" /> Cut-Off Hamlets ({sector.villagesIsolated})
                </span>
                <p className="text-slate-300">
                  {sector.isolatedVillageNames.length > 0
                    ? sector.isolatedVillageNames.join(", ")
                    : "None (Direct Highway Connectivity Intact)"}
                </p>
              </div>

              {/* Emergency Logistics */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-gray-800/80 space-y-1">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Resource Mobilization
                </span>
                <div className="space-y-0.5 text-gray-300">
                  <p>Unit: <b className="text-white">{sector.battalionAssigned}</b></p>
                  <p>Buses: <b className="text-sky-300">{sector.evacuationBuses} Dispatched</b> &bull; Route: <span className="text-gray-400">{sector.routeStatus}</span></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
