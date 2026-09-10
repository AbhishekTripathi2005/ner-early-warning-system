"use client";

import React from "react";
import { Mountain, CloudRain, Radio, Cpu } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface StatCardsProps {
  isOnline?: boolean;
  lang?: Language;
}

export const StatCards: React.FC<StatCardsProps> = ({ isOnline = true, lang = "en" }) => {
  const t = translations[lang] || translations.en;

  const stats = [
    {
      title: t.statCriticalHotspots,
      value: "14",
      unit: t.statSectorsUnit,
      subtext: t.statHotspotsSub,
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      icon: Mountain,
      accentColor: "from-rose-500/20 to-orange-500/20",
      iconColor: "text-rose-400 border-rose-500/30 bg-rose-500/10"
    },
    {
      title: t.statPrecipitation,
      value: "260.4",
      unit: lang === "hi" ? "मिमी" : "mm",
      subtext: t.statRainSub,
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      icon: CloudRain,
      accentColor: "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10"
    },
    {
      title: t.statIoTHillNodes,
      value: "48 / 48",
      unit: lang === "hi" ? "सक्रिय" : "Online",
      subtext: t.statIoTUptime,
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      icon: Radio,
      accentColor: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    },
    {
      title: t.statHybridAiEngine,
      value: isOnline ? (lang === "hi" ? "सक्रिय" : "ONLINE") : (lang === "hi" ? "लोकल" : "LOCAL"),
      unit: "v2.0",
      subtext: isOnline ? t.statAiSubOnline : t.statAiSubOffline,
      badgeColor: isOnline ? "bg-sky-500/15 text-sky-400 border-sky-500/30" : "bg-amber-500/15 text-amber-300 border-amber-500/30",
      icon: Cpu,
      accentColor: isOnline ? "from-sky-500/20 to-indigo-500/20" : "from-amber-500/20 to-orange-500/20",
      iconColor: isOnline ? "text-sky-400 border-sky-500/30 bg-sky-500/10" : "text-amber-400 border-amber-500/30 bg-amber-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden p-4 sm:p-4.5 rounded-2xl bg-[#0c1322] border border-slate-800/80 shadow-lg shadow-black/40 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/60 group"
          >
            {/* Subtle Top-Right Ambient Accent */}
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.accentColor} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none`}
            ></div>

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {s.title}
                </span>

                {/* Big Bold Metric for Immediate Operational Clarity */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl lg:text-[32px] font-black font-mono tracking-tight text-white tabular-nums">
                    {s.value}
                  </span>
                  {s.unit && (
                    <span className="text-xs sm:text-sm font-bold text-slate-300 font-mono tracking-wide">
                      {s.unit}
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border ${s.badgeColor} shadow-sm`}
                  >
                    {s.subtext}
                  </span>
                </div>
              </div>

              {/* Icon Container */}
              <div
                className={`p-2.5 rounded-xl border shrink-0 shadow-sm ${s.iconColor} group-hover:scale-105 transition-transform duration-200`}
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
