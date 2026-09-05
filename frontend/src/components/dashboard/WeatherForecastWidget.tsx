"use client";

import React from "react";
import { CloudRain, Wind, Droplets, AlertCircle } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface WeatherForecastWidgetProps {
  lang: Language;
}

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({ lang }) => {
  const t = translations[lang];

  const forecastData = [
    { period: "Next 6 Hours (Nowcast)", rain: "42.5 mm/h", soil: "92%", risk: "SEVERE", color: "text-red-400" },
    { period: "24-Hour Cumulative", rain: "185.0 mm", soil: "96%", risk: "SEVERE", color: "text-red-400" },
    { period: "48-Hour Anticipated", rain: "290.0 mm", soil: "98%", risk: "CRITICAL WATCH", color: "text-amber-400" }
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
          <CloudRain className="w-5 h-5" />
          <span>{t.weatherForecastTitle}</span>
        </div>
        <span className="text-xs bg-sky-500/10 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-500/30">
          IMD + GPM Satellite Fusion
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {forecastData.map((f, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-gray-800 space-y-2">
            <span className="text-xs font-semibold text-gray-400">{f.period}</span>
            <div className="flex items-center justify-between mt-1">
              <div>
                <span className="text-lg font-black text-white">{f.rain}</span>
                <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                  <Droplets className="w-3 h-3 text-sky-400" /> Soil Saturation: <b className="text-white">{f.soil}</b>
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded bg-black/40 ${f.color}`}>
                {f.risk}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <b>Monsoon Hydro-Meteorological Advisory:</b> A cyclonic circulation over the Bay of Bengal will channel sustained moisture into the Meghalaya & Sikkim escarpments over the next 48 hours. Dynamic soil saturation limits already exceeded in 4 districts.
        </span>
      </div>
    </div>
  );
};
