"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  AlertTriangle,
  Radio,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Users,
  MapPin,
  Clock,
  Send,
  Building,
  PhoneCall
} from "lucide-react";
import { Language } from "../../lib/i18n";

interface EvacuationSirenModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectorData: {
    id: string;
    name: string;
    district: string;
    state: string;
    lat: number;
    lon: number;
    intensity: number;
    tier: string;
    rain48: number;
    soil: number;
  };
  lang: Language;
}

export const EvacuationSirenModal: React.FC<EvacuationSirenModalProps> = ({
  isOpen,
  onClose,
  sectorData,
  lang: initialLang
}) => {
  const [modalLang, setModalLang] = useState<Language>(initialLang);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  // Play synthesized emergency siren tone using Web Audio API (zero external mp3 file needed)
  useEffect(() => {
    if (!isOpen) {
      setDeliveryProgress(0);
      return;
    }

    // Animate broadcast progress bar from 0% to 100% in 1.5s
    const interval = setInterval(() => {
      setDeliveryProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 250);

    // Audio synthesizer
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          // Two-tone emergency siren pitch modulation (800Hz -> 1050Hz)
          const now = ctx.currentTime;
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1050, now + 0.3);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.6);
          osc.frequency.exponentialRampToValueAtTime(1050, now + 0.9);
          osc.frequency.exponentialRampToValueAtTime(800, now + 1.2);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 1.3);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 1.35);
        }
      } catch (e) {
        // Fallback gracefully if browser audio is blocked
      }
    }

    return () => clearInterval(interval);
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  // Emergency localized broadcast message text
  const emergencyMessages = {
    en: {
      headline: "RED ALERT: EMERGENCY EVACUATION ADVISORY",
      authority: "National Disaster Management Authority (NDMA) & MDoNER",
      body: `Extreme landslide danger detected at ${sectorData.name} (${sectorData.district}, ${sectorData.state}). Soil saturation has breached ${sectorData.soil}% with ${sectorData.rain48}mm rainfall. Imminent slope shear hazard.`,
      instruction: "IMMEDIATELY EVACUATE along designated safe routes to Community Relief Shelter #3. Avoid riverbanks and valley road cuts.",
      shelter: "Government Higher Secondary School Relief Camp (1.6 km North)",
      helpline: "Emergency Helpline: 1070 / 112"
    },
    hi: {
      headline: "रेड अलर्ट: तत्काल आपातकालीन निकासी चेतावनी",
      authority: "राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) एवं पूर्वोत्तर विकास मंत्रालय",
      body: `${sectorData.name} (${sectorData.district}) में भारी भूस्खलन का गंभीर खतरा। 48 घंटे में ${sectorData.rain48}mm वर्षा एवं मिट्टी में ${sectorData.soil}% संतृप्ति दर्ज।`,
      instruction: "सभी नागरिक तुरंत मुख्य पहाड़ी मार्ग छोड़कर राहत शिविर #3 में स्थानांतरित हों। राजमार्ग यात्रा तुरंत रोकें।",
      shelter: "राजकीय उच्चतर माध्यमिक विद्यालय राहत शिविर (1.6 किमी उत्तर)",
      helpline: "आपदा हेल्पलाइन: 1070 / 112"
    },
    as: {
      headline: "ৰেড এলাৰ্ট: জৰুৰীকালীন স্থানান্তৰৰ নিৰ্দেশনা",
      authority: "ৰাষ্ট্ৰীয় দুৰ্যোগ ব্যৱস্থাপনা কৰ্তৃপক্ষ (NDMA) আৰু MDoNER",
      body: `${sectorData.name} (${sectorData.district}) অঞ্চলত ভয়াৱহ ভূমিস্খলনৰ আশংকা। মাটিত ${sectorData.soil}% পানীৰ মাত্ৰা আৰু ${sectorData.rain48}mm বৰষুণ।`,
      instruction: "অবিলম্বে পাহাৰীয়া অঞ্চল এৰি আশ্ৰয় শিবিৰলৈ যাওক। ঘাইপথৰ যাতায়ত বন্ধ কৰক।",
      shelter: "চৰকাৰী উচ্চতৰ মাধ্যমিক বিদ্যালয় আশ্ৰয় শিবিৰ (১.৬ কিমি উত্তৰ)",
      helpline: "দুৰ্যোগ হেল্পলাইন: ১০৭০ / ১১২"
    }
  };

  const currentMsg = emergencyMessages[modalLang];

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl bg-[#0c1322] border-2 border-rose-500/70 shadow-[0_0_50px_rgba(244,63,94,0.25)] ring-1 ring-slate-800 p-5 sm:p-7 text-slate-100 space-y-5">
        {/* Modal Top Header with Live Siren Glow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-rose-500/15 text-rose-300 font-mono px-2 py-0.5 rounded-md font-bold border border-rose-500/30">
                  CAP v1.2 LIVE DISPATCH
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ticket #{sectorData.id}-EVAC-2026
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight uppercase mt-0.5">
                Multi-Channel Evacuation Broadcast Simulator
              </h3>
            </div>
          </div>

          {/* Controls: Language Switcher & Audio Toggle & Close */}
          <div className="flex items-center space-x-2 self-end sm:self-center">
            {/* Language Switcher */}
            <div className="flex items-center bg-[#080d1a] border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setModalLang("en")}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  modalLang === "en" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setModalLang("hi")}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  modalLang === "hi" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setModalLang("as")}
                className={`px-2.5 py-1 rounded-lg transition font-bold ${
                  modalLang === "as" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                অসমীয়া
              </button>
            </div>

            {/* Siren Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition ${
                soundEnabled
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
              title={soundEnabled ? "Siren Audio Active" : "Siren Audio Muted"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Broadcast Progress Bar */}
        <div className="p-3.5 rounded-xl bg-[#080d1a] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Cell Broadcast & Multi-Agency Dispatch Status:</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {deliveryProgress === 100 ? "✓ 4,820 / 4,820 DELIVERED (100%)" : `TRANSMITTING... ${deliveryProgress}%`}
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${deliveryProgress}%` }}
            ></div>
          </div>
        </div>

        {/* 2-Column Split: Handset Screen Simulation vs Government CAP Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Column A (Left 5 Cols): Realistic Citizen Smartphone Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Citizen Handset Screen (Overridden Alarm)</span>
            </div>

            {/* Phone Bezel */}
            <div className="w-full max-w-[310px] rounded-[38px] bg-[#020617] border-[4px] border-slate-700/80 shadow-2xl p-3.5 space-y-3 relative overflow-hidden ring-1 ring-slate-600/40">
              {/* Speaker notch */}
              <div className="w-20 h-4 bg-slate-800/80 rounded-full mx-auto mb-1"></div>

              {/* Handset Notification Popup */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-950/80 to-[#0c1322] border-2 border-rose-500/80 shadow-xl space-y-2.5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-1.5 border-b border-rose-500/30">
                  <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                    <span>GOVT EMERGENCY ALERT</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">NOW</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white leading-tight">
                    {currentMsg.headline}
                  </h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {currentMsg.body}
                  </p>
                </div>

                <div className="p-2 rounded-lg bg-red-900/30 border border-red-500/40 text-[10px] text-red-200 font-medium leading-relaxed">
                  ⚠️ <b>{currentMsg.instruction}</b>
                </div>

                <div className="space-y-1 pt-1 text-[10px] text-slate-400 border-t border-rose-500/20">
                  <div className="flex items-center gap-1 text-sky-300">
                    <Building className="w-3 h-3 shrink-0" />
                    <span className="truncate">{currentMsg.shelter}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-300 font-mono font-bold">
                    <PhoneCall className="w-3 h-3 shrink-0" />
                    <span>{currentMsg.helpline}</span>
                  </div>
                </div>
              </div>

              {/* Simulated SMS App Notification */}
              <div className="p-2.5 rounded-xl bg-[#0c1322] border border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-sky-400 font-mono">SMS &bull; BSNL / CDAC-SACHET</span>
                  <span>1m ago</span>
                </div>
                <p className="text-slate-300 text-[10px] line-clamp-2">
                  [MDoNER-LEWS] RED ALERT: Evacuate {sectorData.name}. Dial 1070 for SDRF rescue convoy.
                </p>
              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-slate-700/80 rounded-full mx-auto mt-2"></div>
            </div>
          </div>

          {/* Column B (Right 7 Cols): Government CAP v1.2 Protocol Transmission Details */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Control Room Automated Transmission Receipt</span>
            </div>

            {/* Transmission Metrics 3-Card Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Cell Towers Synced</span>
                <p className="text-sm font-black text-white font-mono tabular-nums">14 Towers</p>
                <span className="text-[10px] text-emerald-400 font-medium">BSNL &bull; Jio &bull; Airtel</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Subscribers Alerted</span>
                <p className="text-sm font-black text-white font-mono tabular-nums">4,820</p>
                <span className="text-[10px] text-sky-400 font-medium">Geofenced Polygon</span>
              </div>
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-medium">Transmission Time</span>
                <p className="text-sm font-black text-white font-mono tabular-nums">1.84 sec</p>
                <span className="text-[10px] text-emerald-400 font-medium">Ultra-Low Latency</span>
              </div>
            </div>

            {/* SDRF Battalion Tasking Card */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SDRF & NDRF Automated Tasking Ticket</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                  #SDRF-NER-2026-089
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                NDRF 1st Battalion (Guwahati/Shillong Base) alerted. 2 rescue teams mobilized with JCB earthmovers and emergency inflatable rafts. Designated liaison officer: <b className="text-white">Deputy Commandant P. Borah (+91-94350-11223)</b>.
              </p>
            </div>

            {/* Standardized NDMA CAP v1.2 Protocol Payload Preview */}
            <div className="p-3 rounded-xl bg-[#050811] border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800 text-[10px]">
                <span>CAP XML/JSON Payload (OASIS Standard)</span>
                <span className="text-sky-400">MDoNER Disaster Protocol</span>
              </div>
              <pre className="text-emerald-400 overflow-x-auto text-[10px] leading-relaxed max-h-36 scrollbar-thin">
{`{
  "identifier": "URN:OID:2.49.0.0.356.NER.${sectorData.id}.2026",
  "sender": "control-room@ner-lews.gov.in",
  "sent": "${new Date().toISOString()}",
  "status": "Actual",
  "msgType": "Alert",
  "scope": "Public",
  "info": {
    "category": "Geo",
    "event": "Landslide Emergency Evacuation",
    "urgency": "Immediate",
    "severity": "Extreme",
    "certainty": "Observed",
    "headline": "${currentMsg.headline}",
    "area": {
      "areaDesc": "${sectorData.district}, ${sectorData.state}",
      "circle": "${sectorData.lat},${sectorData.lon},3.5"
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>All cellular towers in {sectorData.district} acknowledge delivery confirmation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#080d1a] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition"
            >
              Close Dispatch Monitor
            </button>
            <button
              onClick={() => {
                setDeliveryProgress(0);
                setTimeout(() => setDeliveryProgress(100), 800);
              }}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5 active:scale-[0.99]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Re-Broadcast Test Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
