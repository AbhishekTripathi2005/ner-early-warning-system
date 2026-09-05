"use client";

import React, { useState } from "react";
import {
  CloudRain,
  Droplets,
  AlertCircle,
  TrendingUp,
  Activity,
  Wind,
  Gauge,
  Layers,
  Calendar
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { Language, translations } from "../../lib/i18n";

interface WeatherForecastWidgetProps {
  lang: Language;
}

// IMD / GFS / GPM High-Resolution Fusion Time-Series Projection Data
const timeSeriesForecastData = [
  {
    time: "+2h (Now)",
    period: "Nowcast",
    rainfall: 18.5,
    cumulativeRain: 18.5,
    riskScore: 0.42,
    soilSaturation: 88,
    windKmh: 24,
    status: "MODERATE"
  },
  {
    time: "+4h",
    period: "Nowcast",
    rainfall: 32.0,
    cumulativeRain: 50.5,
    riskScore: 0.65,
    soilSaturation: 91,
    windKmh: 31,
    status: "HIGH"
  },
  {
    time: "+6h",
    period: "Nowcast Peak",
    rainfall: 54.8,
    cumulativeRain: 105.3,
    riskScore: 0.88,
    soilSaturation: 94,
    windKmh: 42,
    status: "SEVERE"
  },
  {
    time: "+12h",
    period: "Night Storm",
    rainfall: 62.4,
    cumulativeRain: 167.7,
    riskScore: 0.94,
    soilSaturation: 97,
    windKmh: 46,
    status: "CRITICAL"
  },
  {
    time: "+18h",
    period: "Morning",
    rainfall: 41.2,
    cumulativeRain: 208.9,
    riskScore: 0.82,
    soilSaturation: 95,
    windKmh: 35,
    status: "SEVERE"
  },
  {
    time: "+24h",
    period: "24h Mark",
    rainfall: 28.5,
    cumulativeRain: 237.4,
    riskScore: 0.73,
    soilSaturation: 93,
    windKmh: 28,
    status: "HIGH"
  },
  {
    time: "+36h",
    period: "Day 2",
    rainfall: 19.4,
    cumulativeRain: 256.8,
    riskScore: 0.58,
    soilSaturation: 89,
    windKmh: 22,
    status: "MODERATE"
  },
  {
    time: "+48h",
    period: "Outlook",
    rainfall: 14.2,
    cumulativeRain: 271.0,
    riskScore: 0.39,
    soilSaturation: 83,
    windKmh: 18,
    status: "WATCH"
  }
];

// Custom Dark Tooltip
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isCritical = data.riskScore >= 0.75;

    return (
      <div className="bg-[#0b0f19] border border-gray-700 p-3 rounded-xl shadow-2xl space-y-1.5 text-xs">
        <div className="flex items-center justify-between gap-3 border-b border-gray-800 pb-1">
          <span className="font-bold text-white">{label} ({data.period})</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isCritical
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
            }`}
          >
            {data.status}
          </span>
        </div>
        <div className="space-y-1 text-gray-300">
          <div className="flex justify-between gap-4">
            <span className="text-sky-400 flex items-center gap-1">
              <CloudRain className="w-3 h-3" /> Rainfall Rate:
            </span>
            <b className="text-white font-mono">{data.rainfall} mm/h</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-rose-400 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Landslide Risk Score:
            </span>
            <b className="text-rose-400 font-mono">{(data.riskScore * 100).toFixed(0)}% (LSI {data.riskScore})</b>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-emerald-400 flex items-center gap-1">
              <Droplets className="w-3 h-3" /> Soil Saturation:
            </span>
            <b className="text-white font-mono">{data.soilSaturation}%</b>
          </div>
          <div className="flex justify-between gap-4 border-t border-gray-800/80 pt-1 text-[11px] text-gray-400">
            <span>Cumulative Rainfall:</span>
            <b className="text-gray-200 font-mono">{data.cumulativeRain} mm</b>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({ lang }) => {
  const t = translations[lang] || translations.en;
  const [selectedRange, setSelectedRange] = useState<"ALL" | "NOWCAST" | "EXTENDED">("ALL");

  const filteredData =
    selectedRange === "NOWCAST"
      ? timeSeriesForecastData.slice(0, 3)
      : selectedRange === "EXTENDED"
      ? timeSeriesForecastData.slice(3)
      : timeSeriesForecastData;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-gray-800 space-y-5">
      {/* Header & Data Fusion Badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-gray-800 gap-2.5">
        <div className="flex items-center space-x-2 text-sky-400 font-semibold text-sm">
          <CloudRain className="w-5 h-5" />
          <span>{t.weatherForecastTitle}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-gray-800 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setSelectedRange("ALL")}
              className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                selectedRange === "ALL" ? "bg-sky-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Full 48h Timeline
            </button>
            <button
              onClick={() => setSelectedRange("NOWCAST")}
              className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                selectedRange === "NOWCAST" ? "bg-sky-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              6h Nowcast
            </button>
            <button
              onClick={() => setSelectedRange("EXTENDED")}
              className={`px-2.5 py-1 rounded font-bold transition text-[11px] ${
                selectedRange === "EXTENDED" ? "bg-sky-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              24-48h Extended
            </button>
          </div>

          <span className="text-xs bg-sky-500/10 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/30 font-mono text-[11px]">
            IMD Radar + NASA GPM Fusion
          </span>
        </div>
      </div>

      {/* 4 Hydro-Meteorological Diagnostic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Peak 6h Intensity</span>
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-xl font-black text-white font-mono">54.8 mm/h</p>
          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
            Cloudburst Trigger Zone
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Antecedent Soil Moisture</span>
            <Droplets className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-white font-mono">97.0% Saturation</p>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            AMC-III Critical Threshold
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>48h Cumulative Outlook</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-xl font-black text-white font-mono">271.0 mm</p>
          <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
            GSI Extreme Watch
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-gray-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Doppler Radar Echo</span>
            <Activity className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-xl font-black text-white font-mono">48 dBZ</p>
          <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
            Sohra Escarpment Cell
          </span>
        </div>
      </div>

      {/* Main Interactive Recharts Time-Series Chart */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-gray-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-400 gap-1">
          <span className="font-bold text-gray-200">
            Dual-Axis Projection: Rainfall Rate (mm/h) vs. Landslide Susceptibility Index (0.00 - 1.00)
          </span>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-sky-500 inline-block"></span> Rainfall Rate (mm/h)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-rose-500 inline-block"></span> Landslide Risk Score
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
              />
              {/* Left Y Axis: Rainfall */}
              <YAxis
                yAxisId="left"
                stroke="#38bdf8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
                unit="mm"
                domain={[0, 80]}
              />
              {/* Right Y Axis: Landslide Risk Score (0 - 1.0) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f43f5e"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#374151" }}
                domain={[0, 1]}
                tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              />
              <Tooltip content={<CustomChartTooltip />} />

              {/* Critical Alert Threshold line at 0.70 */}
              <ReferenceLine
                yAxisId="right"
                y={0.70}
                stroke="#ef4444"
                strokeDasharray="4 4"
                label={{
                  value: "SEVERE RISK THRESHOLD (0.70)",
                  fill: "#ef4444",
                  fontSize: 10,
                  position: "insideTopRight"
                }}
              />

              {/* Bar for Precipitation */}
              <Bar
                yAxisId="left"
                dataKey="rainfall"
                name="Rainfall Rate"
                fill="#0ea5e9"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />

              {/* Glowing Line for Landslide Risk Score */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="riskScore"
                name="Landslide Risk Score"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={{ r: 4, fill: "#f43f5e", stroke: "#ffffff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#ffffff", stroke: "#f43f5e", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advisory Callout Box */}
      <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300">
            IMD Synoptic Warning: Bay of Bengal Moisture Incursion (+6h to +18h Peak Impact)
          </p>
          <p className="text-amber-200/90 leading-relaxed">
            Persistent southwest monsoon winds will collide with the Meghalaya Plateau and Sikkim escarpments. Continuous precipitation exceeding 50 mm/h between +4h and +12h will push saturated hill shear stress beyond slope safety factors (FoS &lt; 0.95). Immediate road transit halts advised along NH-10 and NH-206.
          </p>
        </div>
      </div>
    </div>
  );
};
