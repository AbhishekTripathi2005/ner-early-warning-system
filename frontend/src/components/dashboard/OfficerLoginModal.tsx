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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (username === "sih_officer_ner" && password === "sih2026_password") {
        onLoginSuccess({
          username: "sih_officer_ner",
          name: "Major Arvind Sharma",
          badge: "NDRF-NER-884",
          role: "FIELD_DISASTER_COMMANDER"
        });
        setLoading(false);
        onClose();
      } else {
        setError("Invalid badge credentials. Use demo: sih_officer_ner / sih2026_password");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#111827] border border-gray-700 rounded-2xl p-6 shadow-2xl space-y-4 relative z-[5001]">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2.5 text-sky-400">
            <Shield className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">{t.officerLogin}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 font-medium">Officer ID / Username</label>
            <div className="flex items-center bg-slate-900 border border-gray-700 rounded-lg px-3 py-2 mt-1">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium">Security Password</label>
            <div className="flex items-center bg-slate-900 border border-gray-700 rounded-lg px-3 py-2 mt-1">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none w-full"
                required
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/30"
            >
              {loading ? "Authenticating..." : "Authorize Emergency Access"}
            </button>
          </div>
        </form>

        {/* 1-Click Quick Demo Profiles */}
        <div className="pt-3 border-t border-gray-800 space-y-2">
          <p className="text-[11px] text-gray-400 font-medium text-center">
            Quick 1-Click Authenticated Profiles (for Jury Demo):
          </p>
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
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl text-[11px] font-bold text-left transition flex flex-col gap-0.5"
            >
              <span>👮 Major A. Sharma</span>
              <span className="text-[10px] text-gray-400 font-normal font-mono">NDRF Battalion 1</span>
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
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-sky-300 hover:text-white border border-sky-500/30 hover:border-sky-500/60 rounded-xl text-[11px] font-bold text-left transition flex flex-col gap-0.5"
            >
              <span>🛡️ Inspector T. Lepcha</span>
              <span className="text-[10px] text-gray-400 font-normal font-mono">SDRF Sikkim Quick Unit</span>
            </button>
          </div>
          <p className="text-[10px] text-gray-500 text-center font-mono pt-1">
            Manual Credentials: sih_officer_ner / sih2026_password
          </p>
        </div>
      </div>
    </div>
  );
};
