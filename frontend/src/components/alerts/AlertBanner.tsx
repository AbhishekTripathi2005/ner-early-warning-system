"use client";

import React from "react";
import { AlertTriangle, Bell, ShieldAlert, Radio, Flame, ArrowRight } from "lucide-react";

interface AlertItem {
  id: number;
  title: string;
  description: string;
  risk_level: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  state: string;
  district: string;
  leadTime: string;
  timestamp: string;
}

const mockAlerts: AlertItem[] = [
  {
    id: 101,
    title: "RED ALERT: Imminent Slope Failure Threat in East Khasi Hills",
    description: "Cloudburst (>260.4mm in 48h) crossed critical saturation threshold. Pre-emptive evacuation advised along NH-206 corridor.",
    risk_level: "SEVERE",
    state: "Meghalaya",
    district: "East Khasi Hills",
    leadTime: "3.5h Lead Time",
    timestamp: "12m ago"
  },
  {
    id: 102,
    title: "ORANGE ALERT: Highway Toe Erosion & InSAR Creep",
    description: "Active displacement (-28mm/yr) detected along Teesta riverbank at 29th Mile. Convoy restrictions enforced.",
    risk_level: "HIGH",
    state: "Sikkim",
    district: "East Sikkim",
    leadTime: "5.0h Lead Time",
    timestamp: "28m ago"
  }
];

export const AlertBanner: React.FC = () => {
  return (
    <div className="w-full space-y-3">
      {/* Banner Subheader */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <h2 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Active Early Warning Dispatches</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-gray-400 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-gray-800">
            CAP v1.2 Protocol &bull; NDMA Sachet Sync
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1 shadow-sm shadow-rose-500/20 animate-pulse">
            <Radio className="w-3 h-3 text-rose-400" />
            <span>Live Broadcast</span>
          </span>
        </div>
      </div>

      {/* Grid of Alert Cards with Attention-Grabbing Glow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {mockAlerts.map((alert) => {
          const isSevere = alert.risk_level === "SEVERE";
          return (
            <div
              key={alert.id}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-300 group hover:-translate-y-0.5 ${
                isSevere
                  ? "bg-gradient-to-r from-red-950/40 via-red-900/15 to-slate-900/80 border-red-500/60 shadow-lg shadow-red-950/50 ring-1 ring-red-500/30 hover:border-red-400 hover:shadow-red-900/40"
                  : "bg-gradient-to-r from-amber-950/40 via-amber-900/15 to-slate-900/80 border-amber-500/50 shadow-md shadow-amber-950/30 ring-1 ring-amber-500/20 hover:border-amber-400"
              }`}
            >
              {/* Subtle Ambient Background Flare */}
              <div
                className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40 ${
                  isSevere ? "bg-rose-600" : "bg-amber-600"
                }`}
              ></div>

              <div className="flex items-start space-x-3.5 relative z-10">
                {/* Glowing Icon Badge */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 border ${
                    isSevere
                      ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-md shadow-red-500/20"
                      : "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/20"
                  }`}
                >
                  {isSevere ? (
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-black tracking-tight text-white group-hover:text-red-300 transition duration-200 truncate">
                      {alert.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 font-mono border ${
                        isSevere
                          ? "bg-red-500/25 text-red-200 border-red-500/40"
                          : "bg-amber-500/25 text-amber-200 border-amber-500/40"
                      }`}
                    >
                      {alert.risk_level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-gray-400 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-300">{alert.district}, {alert.state}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-sky-400 font-medium">{alert.leadTime}</span>
                    </div>
                    <span className="font-mono text-gray-500">{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
