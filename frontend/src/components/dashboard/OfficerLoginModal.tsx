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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#111827] border border-gray-700 rounded-2xl p-6 shadow-2xl space-y-4">
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
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              {loading ? "Authenticating..." : "Authorize Emergency Access"}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-gray-500 text-center">
          SIH 2026 Demo Access: <code className="text-gray-300">sih_officer_ner / sih2026_password</code>
        </p>
      </div>
    </div>
  );
};
