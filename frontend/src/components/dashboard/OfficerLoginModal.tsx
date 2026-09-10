"use client";

import React, { useState } from "react";
import { Shield, Lock, User, X, CheckCircle } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

interface OfficerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (officer: any) => void;
  lang: Language;
}

export const OfficerLoginModal: React.FC<OfficerLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, lang }) => {
  const t = translations[lang];
  const [username, setUsername] = useState("sih_officer_ner");
  const [password, setPassword] = useState("sih2026_password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Real cryptographic API handshake with FastAPI backend (Bcrypt + PyJWT)
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("sih_officer_token", data.token);
          localStorage.setItem("sih_auth_mode", "LIVE_COMMAND");
        }
        onLoginSuccess({
          ...data.officer,
          name: data.officer.full_name,
          badge: data.officer.badge_id,
          token: data.token,
          authMode: "LIVE_COMMAND",
          isViewOnlyDemo: false
        });
        setLoading(false);
        onClose();
        return;
      } else {
        const errData = await res.json().catch(() => null);
        const errMsg = errData?.detail || "Authentication rejected: Invalid officer credentials";
        setError(errMsg);
        setLoading(false);
        return;
      }
    } catch (networkErr) {
      // 2. Safe Fallback to "View-Only Demo Mode" (Patch 5) if backend server is unreachable
      if (username === "sih_officer_ner" && password === "sih2026_password") {
        if (typeof window !== "undefined") {
          localStorage.setItem("sih_auth_mode", "VIEW_ONLY_DEMO");
        }
        onLoginSuccess({
          username: "sih_officer_ner",
          name: "Major Arvind Sharma",
          badge: "NDRF-NER-884",
          role: "FIELD_DISASTER_COMMANDER",
          authMode: "VIEW_ONLY_DEMO",
          isViewOnlyDemo: true
        });
        setLoading(false);
        onClose();
      } else {
        setError("Backend server offline and credentials do not match demo profile.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0c1322] border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/80 ring-1 ring-slate-700/30 space-y-4 relative z-[5001]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">{t.officerLogin}</h3>
              <p className="text-[10px] text-slate-400 font-mono">NDRF / SDRF Incident Command Verification</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-300 font-semibold tracking-wide">Officer ID / Badge Code</label>
            <div className="flex items-center bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2.5 mt-1 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50 transition">
              <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent text-xs text-white font-mono focus:outline-none w-full placeholder-slate-500"
                placeholder="e.g. sih_officer_ner"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-semibold tracking-wide">Security PIN / Password</label>
            <div className="flex items-center bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2.5 mt-1 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50 transition">
              <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs text-white font-mono focus:outline-none w-full placeholder-slate-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-medium">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 active:scale-[0.99]"
            >
              <Shield className="w-4 h-4" />
              <span>{loading ? "Authenticating Authority..." : "Authorize Emergency Access"}</span>
            </button>
          </div>
        </form>

        {/* 1-Click Quick Demo Profiles */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Jury Evaluation Profiles:</span>
            <span className="text-[10px] text-sky-400 font-mono font-semibold">1-Click Fast Pass</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onLoginSuccess({
                  username: "sih_officer_ner",
                  name: "Major Arvind Sharma",
                  badge: "NDRF-NER-884",
                  role: "FIELD_DISASTER_COMMANDER"
                });
                onClose();
              }}
              className="p-2.5 bg-[#080d1a] hover:bg-slate-800/90 text-emerald-300 hover:text-white border border-emerald-500/20 hover:border-emerald-500/50 rounded-xl text-[11px] font-bold text-left transition flex flex-col gap-0.5 group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="font-semibold text-slate-200 group-hover:text-white">Major A. Sharma</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono pl-3">NDRF Battalion 1</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onLoginSuccess({
                  username: "sdrf_lepcha",
                  name: "Inspector T. Lepcha",
                  badge: "SDRF-SK-102",
                  role: "SDRF_INSPECTOR"
                });
                onClose();
              }}
              className="p-2.5 bg-[#080d1a] hover:bg-slate-800/90 text-sky-300 hover:text-white border border-sky-500/20 hover:border-sky-500/50 rounded-xl text-[11px] font-bold text-left transition flex flex-col gap-0.5 group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                <span className="font-semibold text-slate-200 group-hover:text-white">Insp. T. Lepcha</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono pl-3">SDRF Sikkim Quick Unit</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 text-center font-mono pt-1">
            Manual Credentials: <span className="text-slate-400">sih_officer_ner</span> / <span className="text-slate-400">sih2026_password</span>
          </p>
        </div>
      </div>
    </div>
  );
};
