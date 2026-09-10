"use client";

import React from "react";
import { X, Printer, Shield, AlertTriangle, CheckCircle2, FileText, Truck } from "lucide-react";
import { Language } from "../../lib/i18n";

interface SitRepModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SitRepModal: React.FC<SitRepModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0c1322] border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-8 space-y-6 text-slate-100 ring-1 ring-slate-700/40">
        {/* Header with Print & Close Controls */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-red-500/20 text-red-300 font-mono px-2 py-0.5 rounded font-bold border border-red-500/40">
                  CONFIDENTIAL &bull; FOR OFFICIAL DISASTER USE ONLY
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  DOC-ID: NDMA-NER-SITREP-2026-09
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-1">
                Integrated Disaster Situation Report (SitRep)
              </h2>
              <p className="text-xs text-slate-400">
                Ministry of Development of North Eastern Region (MDoNER) &bull; National Disaster Management Authority
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-sky-600/20"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SitRep Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#080d1a] rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400">Report Generation</span>
            <p className="font-mono font-bold text-white text-[11px]">{currentDate}</p>
            <span className="text-[10px] text-sky-400 font-mono">06:00 IST Briefing</span>
          </div>

          <div className="p-3 bg-[#080d1a] rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400">Threat Level (NER)</span>
            <p className="font-mono font-black text-red-400 text-sm">OPCON LEVEL-3</p>
            <span className="text-[10px] text-rose-300">Monsoon Surge Warning</span>
          </div>

          <div className="p-3 bg-[#080d1a] rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400">Population at High Risk</span>
            <p className="font-mono font-black text-amber-400 text-sm">34,200</p>
            <span className="text-[10px] text-slate-400">Across 14 Vulnerable Pockets</span>
          </div>

          <div className="p-3 bg-[#080d1a] rounded-xl border border-slate-800 space-y-0.5">
            <span className="text-[10px] text-slate-400">NDRF Teams Tasked</span>
            <p className="font-mono font-black text-emerald-400 text-sm">3 Battalions</p>
            <span className="text-[10px] text-emerald-400">Active Field Pre-positioning</span>
          </div>
        </div>

        {/* Section 1: Executive Threat Appraisal */}
        <div className="space-y-2 text-xs">
          <h3 className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>1. Executive Hydro-Geological Threat Appraisal</span>
          </h3>
          <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-2 text-slate-300 leading-relaxed text-[11px]">
            <p>
              Continuous 48-hour rainfall exceeding <b>260.4 mm</b> in the East Khasi Hills (Cherrapunji Escarpment) combined with 94% soil pore saturation has crossed the empirical factor-of-safety threshold. Immediate shallow translational landslide and debris flow risk is categorized as <b>EXTREME</b>.
            </p>
            <p>
              In Sikkim, satellite InSAR radar interferometry (Sentinel-1) indicates continuous displacement rate of <b>-32.5 mm/year</b> along the NH-10 Teesta River corridor at 29th Mile. Severe embankment undercutting threatens complete isolation of Gangtok and Kalimpong.
            </p>
          </div>
        </div>

        {/* Section 2: Lifeline Highway & Isolation Status */}
        <div className="space-y-2 text-xs">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            <span>2. Lifeline Highways & Isolated Pockets</span>
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#080d1a]">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Corridor</th>
                  <th className="p-2.5">Section</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Isolated Hamlets</th>
                  <th className="p-2.5">Clearance ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5 font-bold text-white">NH-10</td>
                  <td className="p-2.5">Sevoke to Teesta Bazaar (Km 29)</td>
                  <td className="p-2.5 text-rose-400 font-bold font-mono">BLOCKED</td>
                  <td className="p-2.5">5 Villages (18,400 residents)</td>
                  <td className="p-2.5 text-amber-400 font-mono">6 Hours</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">NH-10</td>
                  <td className="p-2.5">Singtam to Gangtok</td>
                  <td className="p-2.5 text-amber-400 font-bold font-mono">ONE-WAY ESCORT</td>
                  <td className="p-2.5">2 Hamlets (6,200 residents)</td>
                  <td className="p-2.5 text-amber-400 font-mono">2 Hours</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">SH-5</td>
                  <td className="p-2.5">Mawkdok Dympep Bridge</td>
                  <td className="p-2.5 text-sky-400 font-bold font-mono">CAUTION</td>
                  <td className="p-2.5">Dympep Cluster (1,850)</td>
                  <td className="p-2.5 text-emerald-400 font-mono">Clear</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-white">NH-6</td>
                  <td className="p-2.5">Nongpoh to Umiam Lake</td>
                  <td className="p-2.5 text-emerald-400 font-bold font-mono">OPERATIONAL</td>
                  <td className="p-2.5">None (Supply Corridor Open)</td>
                  <td className="p-2.5 text-emerald-400 font-mono">Clear</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Recommended Tactical Directives */}
        <div className="space-y-2 text-xs">
          <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Directives for District Emergency Operations Centers (DEOCs)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 bg-[#080d1a] rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white text-[11px] flex items-center gap-1 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" /> District Collector, East Khasi Hills:
              </span>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Trigger localized cell broadcast sirens for Sohra and Laitkynsew. Evacuate 45 vulnerable households near slope crest to Relief Camp #3 (Govt H.S. School).
              </p>
            </div>

            <div className="p-3 bg-[#080d1a] rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white text-[11px] flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" /> District Collector, East Sikkim:
              </span>
              <p className="text-slate-300 text-[10px] leading-relaxed">
                Coordinate with Border Roads Organisation (Project Swastik) for earthmover deployment at Km 29. Enforce light-vehicle detour via Panbu-Jorethang.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Sign-off */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <span>Signed: Officer-in-Charge, Central Control Room &bull; MDoNER Early Warning Cell</span>
          <span className="font-mono">NDMA Crisis Line: 1070 / 112 &bull; ner-lews.gov.in</span>
        </div>
      </div>
    </div>
  );
};
