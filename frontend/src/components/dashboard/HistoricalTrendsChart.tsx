"use client";

import React from "react";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface HistoricalTrendsChartProps {
  lang: Language;
}

const yearlyData = [
  { year: "2018", events: 88, severe: 12, height: "42%" },
  { year: "2019", events: 104, severe: 18, height: "50%" },
  { year: "2020", events: 132, severe: 24, height: "62%" },
  { year: "2021", events: 121, severe: 20, height: "58%" },
  { year: "2022", events: 198, severe: 42, height: "94%" },
  { year: "2023", events: 174, severe: 34, height: "82%" },
  { year: "2024", events: 210, severe: 46, height: "100%" },
  { year: "2025", events: 185, severe: 38, height: "88%" }
];

export const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1322] border border-slate-800/90 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/90">
        <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
          <BarChart3 className="w-5 h-5" />
          <span className="uppercase tracking-wide">{t.historicalTrendsTitle}</span>
        </div>
        <span className="text-xs bg-slate-950 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono text-[11px]">
          GSI & MDoNER Archive
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bar Chart Representation */}
        <div className="md:col-span-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Annual Landslide Incidences in NER</span>
            <span className="text-rose-400 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +138% Surge Since 2018
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2 border-b border-slate-800/80">
            {yearlyData.map((d) => (
              <div key={d.year} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">{d.events}</span>
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-sky-600 via-sky-500 to-rose-500 transition-all hover:opacity-85"
                  style={{ height: d.height }}
                  title={`${d.year}: ${d.events} events (${d.severe} severe)`}
                ></div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 tabular-nums">{d.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* State Breakdown Card */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Top Vulnerable States</h4>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Meghalaya</span>
                <b className="font-mono tabular-nums">28.5%</b>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full w-[28.5%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Sikkim</span>
                <b className="font-mono tabular-nums">24.2%</b>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-orange-500 h-full rounded-full w-[24.2%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Assam (Dima Hasao)</span>
                <b className="font-mono tabular-nums">18.1%</b>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full w-[18.1%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Mizoram & Nagaland</span>
                <b className="font-mono tabular-nums">21.0%</b>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full w-[21.0%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
