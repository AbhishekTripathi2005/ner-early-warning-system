"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Bell, ShieldAlert, Radio, Volume2, Square } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

export interface AlertItem {
  id: number;
  title: string;
  description: string;
  risk_level: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  state: string;
  district: string;
  leadTime: string;
  timestamp: string;
  // Multi-lingual overrides
  title_hi?: string;
  desc_hi?: string;
  state_hi?: string;
  district_hi?: string;
  leadTime_hi?: string;
  timestamp_hi?: string;

  title_as?: string;
  desc_as?: string;
  state_as?: string;
  district_as?: string;
  leadTime_as?: string;
  timestamp_as?: string;

  title_brx?: string;
  desc_brx?: string;
  state_brx?: string;
  district_brx?: string;
  leadTime_brx?: string;
  timestamp_brx?: string;

  title_kha?: string;
  desc_kha?: string;
  state_kha?: string;
  district_kha?: string;
  leadTime_kha?: string;
  timestamp_kha?: string;
}

export const mockAlerts: AlertItem[] = [
  {
    id: 101,
    title: "RED ALERT: Imminent Slope Failure Threat in East Khasi Hills",
    description: "Cloudburst (>260.4mm in 48h) crossed critical saturation threshold. Pre-emptive evacuation advised along NH-206 corridor.",
    risk_level: "SEVERE",
    state: "Meghalaya",
    district: "East Khasi Hills",
    leadTime: "3.5h Lead Time",
    timestamp: "12m ago",
    // Hindi
    title_hi: "लाल चेतावनी: पूर्वी खासी हिल्स में आसन्न भूस्खलन का गंभीर खतरा",
    desc_hi: "अत्यधिक वर्षा (48 घंटे में >260.4 मिमी) से मिट्टी संतृप्ति सीमा पार। NH-206 गलियारे में तुरंत पूर्व-निकासी की सलाह।",
    state_hi: "मेघालय",
    district_hi: "पूर्वी खासी हिल्स",
    leadTime_hi: "3.5 घंटे का समय",
    timestamp_hi: "12 मिनट पहले",
    // Assamese
    title_as: "ৰঙা সতৰ্কবাণী: পূব খাছী পাহাৰত শীঘ্ৰেই ভূমিস্খলনৰ ভয়াৱহ আশংকা",
    desc_as: "প্ৰৱল বৰষুণে (৪৮ ঘণ্টাত >২৬০.৪ মিমি) বিপদসীমা অতিক্ৰম কৰিছে। NH-206 পথত তৎকালেই স্থান ত্যাগৰ নিৰ্দেশ।",
    state_as: "মেঘালয়",
    district_as: "পূব খাছী পাহাৰ",
    leadTime_as: "৩.৫ ঘণ্টাৰ সময়",
    timestamp_as: "১২ মিনিট পূৰ্বে",
    // Bodo
    title_brx: "गोजा सांग्रांथि: सान्जा खासि हाजोआव हा बाग्लायनायनि गोख्रों खैफोद",
    desc_brx: "गोख्रों अखा (४८ घन्टायाव >२६०.४ मिमि) खैफोद सिमा बारबाय। NH-206 लामायाव मानसिफोरखौ होखारनो खौरां हरबाय।",
    state_brx: "मेघालय",
    district_brx: "सान्जा खासि हाजो",
    leadTime_brx: "३.५ घन्टा सम",
    timestamp_brx: "१२ मिनिट सिगां",
    // Khasi
    title_kha: "MAHAM BASAW: Ka jingtwad khyndew kaba shyrkhei ha East Khasi Hills",
    desc_kha: "Slap jur (>260.4mm ha 48 kynta) la palat ia ka pud. Pynkynriah mardor ia ki nongshongshnong ha lynter surok NH-206.",
    state_kha: "Meghalaya",
    district_kha: "East Khasi Hills",
    leadTime_kha: "3.5 Kynta Por",
    timestamp_kha: "12 Minit mynshwa"
  },
  {
    id: 102,
    title: "ORANGE ALERT: Highway Toe Erosion & InSAR Creep",
    description: "Active displacement (-28mm/yr) detected along Teesta riverbank at 29th Mile. Convoy restrictions enforced.",
    risk_level: "HIGH",
    state: "Sikkim",
    district: "East Sikkim",
    leadTime: "5.0h Lead Time",
    timestamp: "28m ago",
    // Hindi
    title_hi: "नारंगी चेतावनी: राजमार्ग कटाव एवं इनसार (InSAR) भूमि खिसकाव",
    desc_hi: "29वें मील पर तीस्ता नदी किनारे सक्रिय कटाव (-28 मिमी/वर्ष) दर्ज। वाहनों के काफिले पर प्रतिबंध लागू।",
    state_hi: "सिक्किम",
    district_hi: "पूर्वी सिक्किम",
    leadTime_hi: "5.0 घंटे का समय",
    timestamp_hi: "28 मिनट पहले",
    // Assamese
    title_as: "কমলা সতৰ্কবাণী: ঘাইপথ খহনীয়া আৰু InSAR স্থানচ্যুতি",
    desc_as: "২৯ মাইলত তিস্তা নদীৰ পাৰত সক্ৰিয় স্থানচ্যুতি (-২৮ মিমি/বছৰ) ধৰা পৰিছে। কনভয় চলাচলত বাধা আৰোপ।",
    state_as: "ছিকিম",
    district_as: "পূব ছিকিম",
    leadTime_as: "৫.০ ঘণ্টাৰ সময়",
    timestamp_as: "২৮ মিনিট পূৰ্বে",
    // Bodo
    title_brx: "कमला सांग्रांथि: राजलामा खायनाय आरो InSAR थाथाय",
    desc_brx: "२९ माइल तिस्ता दैसा सिथाबनायाव खायनाय (-२८ मिमि/बोसोर) नुबाय। कन्भोय थांनायाव गोख्रोंथि खालामबाय।",
    state_brx: "सिक्किम",
    district_brx: "सान्जा सिक्किम",
    leadTime_brx: "५.० घन्टा सम",
    timestamp_brx: "२८ मिनिट सिगां",
    // Khasi
    title_kha: "MAHAM BASHIEW: Jingjulor ka Tbian Surok & InSAR Creep",
    desc_kha: "Ka jingkhih khyndew (-28mm/snem) ha rud wah Teesta ha 29th Mile. Khang ia ki kali heh.",
    state_kha: "Sikkim",
    district_kha: "East Sikkim",
    leadTime_kha: "5.0 Kynta Por",
    timestamp_kha: "28 Minit mynshwa"
  }
];

export function getLocalizedAlert(alert: AlertItem, lang: Language) {
  if (lang === "hi") {
    return {
      title: alert.title_hi || alert.title,
      description: alert.desc_hi || alert.description,
      state: alert.state_hi || alert.state,
      district: alert.district_hi || alert.district,
      leadTime: alert.leadTime_hi || alert.leadTime,
      timestamp: alert.timestamp_hi || alert.timestamp,
      riskLevelText: alert.risk_level === "SEVERE" ? "अति गंभीर" : alert.risk_level === "HIGH" ? "गंभीर" : alert.risk_level
    };
  }
  if (lang === "as") {
    return {
      title: alert.title_as || alert.title,
      description: alert.desc_as || alert.description,
      state: alert.state_as || alert.state,
      district: alert.district_as || alert.district,
      leadTime: alert.leadTime_as || alert.leadTime,
      timestamp: alert.timestamp_as || alert.timestamp,
      riskLevelText: alert.risk_level === "SEVERE" ? "অতি ভয়াৱহ" : alert.risk_level === "HIGH" ? "উচ্চ বিপদ" : alert.risk_level
    };
  }
  if (lang === "brx") {
    return {
      title: alert.title_brx || alert.title,
      description: alert.desc_brx || alert.description,
      state: alert.state_brx || alert.state,
      district: alert.district_brx || alert.district,
      leadTime: alert.leadTime_brx || alert.leadTime,
      timestamp: alert.timestamp_brx || alert.timestamp,
      riskLevelText: alert.risk_level === "SEVERE" ? "जोबोर गोख्रों" : alert.risk_level === "HIGH" ? "गोजौ" : alert.risk_level
    };
  }
  if (lang === "kha") {
    return {
      title: alert.title_kha || alert.title,
      description: alert.desc_kha || alert.description,
      state: alert.state_kha || alert.state,
      district: alert.district_kha || alert.district,
      leadTime: alert.leadTime_kha || alert.leadTime,
      timestamp: alert.timestamp_kha || alert.timestamp,
      riskLevelText: alert.risk_level === "SEVERE" ? "Kham Ma Jur" : alert.risk_level === "HIGH" ? "Hajrong" : alert.risk_level
    };
  }
  return {
    title: alert.title,
    description: alert.description,
    state: alert.state,
    district: alert.district,
    leadTime: alert.leadTime,
    timestamp: alert.timestamp,
    riskLevelText: alert.risk_level
  };
}

interface AlertBannerProps {
  lang?: Language;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ lang = "en" }) => {
  const t = translations[lang] || translations.en;
  const [speakingId, setSpeakingId] = useState<number | null>(null);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = (alertItem: AlertItem) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Text-to-Speech Web API is not supported in this browser.");
      return;
    }

    // If already speaking this alert, stop it
    if (speakingId === alertItem.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const loc = getLocalizedAlert(alertItem, lang);

    // Construct localized speech utterance text
    let speechText = "";
    if (lang === "hi") {
      speechText = `सावधान: ${loc.district}, ${loc.state} में ${loc.riskLevelText} भूस्खलन की पूर्व चेतावनी। अनुमानित समय ${loc.leadTime}। ${loc.description}`;
    } else if (lang === "as") {
      speechText = `সতৰ্কবাণী: ${loc.district}, ${loc.state}ত ${loc.riskLevelText} ভূমিস্খলনৰ সতৰ্কবাণী। সময় ${loc.leadTime}। ${loc.description}`;
    } else if (lang === "brx") {
      speechText = `सांग्रांथि: ${loc.district}, ${loc.state}आव हा बाग्लायनायनि सांग्रांथि। सम ${loc.leadTime}। ${loc.description}`;
    } else if (lang === "kha") {
      speechText = `Maham: Ka jingtwad khyndew ha ${loc.district}, ${loc.state}। Por ${loc.leadTime}। ${loc.description}`;
    } else {
      speechText = `Emergency Alert: ${alertItem.risk_level} landslide warning in ${loc.district}, ${loc.state}. Estimated lead time is ${loc.leadTime}. ${loc.description}`;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.95; // Slightly measured rate for emergency clarity
    utterance.pitch = 1.0;

    // Pick best matching voice
    if (lang === "hi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onstart = () => {
      setSpeakingId(alertItem.id);
    };

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full space-y-3">
      {/* Banner Subheader */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center space-x-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </div>
          <h2 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>{t.activeAlerts}</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-gray-400 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-gray-800">
            {lang === "hi" ? "CAP v1.2 प्रोटोकॉल • NDMA सचेत सिंक" : "CAP v1.2 Protocol • NDMA Sachet Sync"}
          </span>
          <div className="text-[10px] uppercase font-bold tracking-wider bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/40 inline-flex items-center gap-1 shadow-sm shadow-rose-500/20 animate-pulse">
            <Radio className="w-3 h-3 text-rose-400" />
            <span>{t.broadcastLive}</span>
          </div>
        </div>
      </div>

      {/* Grid of Alert Cards with Clean Severity Accents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {mockAlerts.map((alert) => {
          const isSevere = alert.risk_level === "SEVERE";
          const isCurrentlySpeaking = speakingId === alert.id;
          const loc = getLocalizedAlert(alert, lang);

          return (
            <div
              key={alert.id}
              className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-200 group hover:-translate-y-0.5 ${
                isSevere
                  ? "bg-[#0d1424] border-slate-800 border-l-4 border-l-rose-500 shadow-lg shadow-black/40 hover:border-slate-700 hover:border-l-rose-400"
                  : "bg-[#0d1424] border-slate-800 border-l-4 border-l-amber-500 shadow-lg shadow-black/40 hover:border-slate-700 hover:border-l-amber-400"
              }`}
            >
              {/* Subtle Corner Glow */}
              <div
                className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 ${
                  isSevere ? "bg-rose-500" : "bg-amber-500"
                }`}
              ></div>

              <div className="flex items-start space-x-3.5 relative z-10">
                {/* Status Icon Badge */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 border ${
                    isSevere
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {isSevere ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-rose-200 transition duration-150 truncate">
                      {loc.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 font-mono border ${
                        isSevere
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/35"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/35"
                      }`}
                    >
                      {loc.riskLevelText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {loc.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-300">{loc.district}, {loc.state}</span>
                      <span className="text-slate-600">&bull;</span>
                      <span className="font-mono text-sky-400 font-semibold bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded text-[10px]">
                        {loc.leadTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Voice Alert Button (Web Speech API) */}
                      <button
                        type="button"
                        onClick={() => handleToggleSpeak(alert)}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                          isCurrentlySpeaking
                            ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 animate-pulse"
                            : "bg-slate-900/90 text-sky-300 border-sky-500/30 hover:bg-sky-600/20 hover:text-white hover:border-sky-500/50"
                        }`}
                        title="Text-to-Speech Voice Broadcast for Low-Literacy Users"
                      >
                        {isCurrentlySpeaking ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>{t.stopVoiceAlert}</span>
                            <div className="flex space-x-0.5 ml-1 items-end h-2.5">
                              <span className="w-0.5 h-2 bg-white animate-bounce"></span>
                              <span className="w-0.5 h-3 bg-white animate-bounce delay-75"></span>
                              <span className="w-0.5 h-1.5 bg-white animate-bounce delay-150"></span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>{t.listenVoiceAlert}</span>
                          </>
                        )}
                      </button>

                      <span className="font-mono text-slate-500 text-[10px] tabular-nums">{loc.timestamp}</span>
                    </div>
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
