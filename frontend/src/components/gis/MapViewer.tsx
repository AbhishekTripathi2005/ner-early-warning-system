"use client";

import React, { useState } from "react";
import { Layers, Compass, ZoomIn, ZoomOut, AlertCircle, Info } from "lucide-react";

interface ZoneData {
  id: string;
  name: string;
  state: string;
  lsi: number;
  slope: number;
  rainfall: number;
  risk: "SEVERE" | "HIGH" | "MODERATE" | "LOW";
  color: string;
}

const mockZones: ZoneData[] = [
  {
    id: "NER-ML-01",
    name: "East Khasi Hills (Cherrapunji)",
    state: "Meghalaya",
    lsi: 0.89,
    slope: 44.5,
    rainfall: 260.4,
    risk: "SEVERE",
    color: "#ef4444"
  },
  {
    id: "NER-SK-02",
    name: "Gangtok-Singtam Corridor",
    state: "Sikkim",
    lsi: 0.78,
    slope: 38.2,
    rainfall: 145.0,
    risk: "HIGH",
    color: "#f97316"
  },
  {
    id: "NER-AS-03",
    name: "Dima Hasao Hill Slopes (Haflong)",
    state: "Assam",
    lsi: 0.62,
    slope: 29.0,
    rainfall: 98.2,
    risk: "MODERATE",
    color: "#f59e0b"
  },
  {
    id: "NER-MZ-04",
    name: "Champhai Sector",
    state: "Mizoram",
    lsi: 0.28,
    slope: 18.5,
    rainfall: 22.0,
    risk: "LOW",
    color: "#10b981"
  }
];

export const MapViewer: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneData>(mockZones[0]);
  const [activeLayer, setActiveLayer] = useState<"susceptibility" | "rainfall" | "slope">("susceptibility");

  return (
    <div className="relative w-full h-[520px] bg-[#0d1322] rounded-2xl border border-gray-800 overflow-hidden flex flex-col md:flex-row">
      {/* Interactive Canvas Simulation */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-6 flex flex-col justify-between">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700 text-xs">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-gray-300 font-medium">Layer:</span>
            <button
              onClick={() => setActiveLayer("susceptibility")}
              className={`px-2 py-0.5 rounded ${activeLayer === "susceptibility" ? "bg-sky-600 text-white" : "text-gray-400"}`}
            >
              LSI Hazard
            </button>
            <button
              onClick={() => setActiveLayer("rainfall")}
              className={`px-2 py-0.5 rounded ${activeLayer === "rainfall" ? "bg-sky-600 text-white" : "text-gray-400"}`}
            >
              IMD Rainfall
            </button>
            <button
              onClick={() => setActiveLayer("slope")}
              className={`px-2 py-0.5 rounded ${activeLayer === "slope" ? "bg-sky-600 text-white" : "text-gray-400"}`}
            >
              SRTM Slope
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur p-1 rounded-lg border border-gray-700">
            <button className="p-1.5 hover:bg-slate-800 rounded text-gray-400 hover:text-white" title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-800 rounded text-gray-400 hover:text-white" title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-slate-800 rounded text-gray-400 hover:text-white" title="Compass reset">
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Map Representation of NER Hotspots */}
        <div className="relative w-full h-64 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            {/* Topographic Contour lines mock */}
            <div className="w-96 h-96 rounded-full border-2 border-dashed border-sky-400 animate-spin" style={{ animationDuration: '60s' }}></div>
            <div className="w-72 h-72 rounded-full border border-sky-300 absolute"></div>
            <div className="w-48 h-48 rounded-full border border-sky-200 absolute"></div>
          </div>

          <div className="grid grid-cols-2 gap-6 z-10 w-full max-w-lg">
            {mockZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedZone.id === zone.id
                    ? "bg-slate-800/90 border-sky-400 shadow-lg shadow-sky-500/10 scale-105"
                    : "bg-slate-900/60 border-gray-800 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{zone.id}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  ></span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-1 truncate">{zone.name}</h4>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
                  <span>LSI: <b>{zone.lsi}</b></span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${zone.color}20`, color: zone.color }}
                  >
                    {zone.risk}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs text-gray-400 bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-800 w-fit">
          <span className="font-semibold text-gray-300">Risk Scale:</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low (&lt;0.35)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Severe (&gt;0.75)</span>
        </div>
      </div>

      {/* Selected Zone Telemetry Panel */}
      <div className="w-full md:w-80 bg-[#111827] border-t md:border-t-0 md:border-l border-gray-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <span className="text-xs text-sky-400 font-mono font-medium">{selectedZone.id}</span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedZone.name}</h3>
              <p className="text-xs text-gray-400">{selectedZone.state}, India</p>
            </div>
            <span
              className="px-2.5 py-1 rounded text-xs font-bold"
              style={{ backgroundColor: `${selectedZone.color}20`, color: selectedZone.color }}
            >
              {selectedZone.risk}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="p-3 bg-slate-900/80 rounded-lg border border-gray-800">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Landslide Susceptibility Index</span>
                <span className="font-bold text-white">{(selectedZone.lsi * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedZone.lsi * 100}%`, backgroundColor: selectedZone.color }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-lg border border-gray-800">
                <span className="text-gray-400">Slope Gradient</span>
                <p className="text-sm font-bold text-white mt-1">{selectedZone.slope}°</p>
                <span className="text-[10px] text-gray-500">SRTM 30m DEM</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-lg border border-gray-800">
                <span className="text-gray-400">72h Cumulative</span>
                <p className="text-sm font-bold text-white mt-1">{selectedZone.rainfall} mm</p>
                <span className="text-[10px] text-gray-500">IMD AWS Network</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Threshold rule: Combined slope (&gt;35°) and 72h rainfall (&gt;200mm) triggers automated SMS siren protocol.
              </span>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition">
          Simulate Evacuation Siren Broadcast
        </button>
      </div>
    </div>
  );
};
