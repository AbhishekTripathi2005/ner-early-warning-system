"use client";

import React from "react";
import { Mountain, CloudRain, Activity, Radio, AlertOctagon, TrendingUp, CheckCircle, Cpu } from "lucide-react";

export const StatCards: React.FC = () => {
  const stats = [
    {
      title: "NER Critical Hotspots",
      value: "14",
      unit: "Sectors",
      subtext: "+2 Critical (Severe Tier)",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      icon: Mountain,
      accentColor: "from-rose-500/20 to-orange-500/20",
      iconColor: "text-rose-400 border-rose-500/30 bg-rose-500/10"
    },
    {
      title: "Peak 48h Precipitation",
      value: "260.4",
      unit: "mm",
      subtext: "Cherrapunji AWS Threshold Crossed",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      icon: CloudRain,
      accentColor: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10"
    },
    {
      title: "Active IoT Hill Nodes",
      value: "48 / 48",
      unit: "Online",
      subtext: "99.4% Multi-Sensor Telemetry Uptime",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: Radio,
      accentColor: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    },
    {
      title: "Hybrid AI Inference Engine",
      value: "ONLINE",
      unit: "v2.0",
      subtext: "Static LSI + LSTM 2-6h Nowcasting",
      badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
      icon: Cpu,
      accentColor: "from-sky-500/20 to-indigo-500/20",
      iconColor: "text-sky-400 border-sky-500/30 bg-sky-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-gray-800/90 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-700 hover:shadow-2xl hover:shadow-black/50 group"
          >
            {/* Subtle Top-Right Ambient Glow */}
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.accentColor} blur-xl opacity-30 group-hover:opacity-60 transition duration-300 pointer-events-none`}
            ></div>

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block truncate">
                  {s.title}
                </span>

                {/* Big Bold Metric for Strong Visual Hierarchy */}
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="text-xs font-semibold text-gray-400 font-mono">
                      {s.unit}
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${s.badgeColor}`}
                  >
                    {s.subtext}
                  </span>
                </div>
              </div>

              {/* Icon Container with Glow */}
              <div
                className={`p-3 rounded-xl border shrink-0 shadow-md ${s.iconColor} group-hover:scale-105 transition duration-200`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
