"use client";

import React, { useState } from "react";
import { X, Upload, Camera, Image as ImageIcon, MapPin, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { Language, translations } from "../../lib/i18n";

export interface CitizenReportData {
  id: number;
  reporter: string;
  phone: string;
  location: string;
  lat: number;
  lon: number;
  district: string;
  state: string;
  hazard: string;
  severity: "MODERATE" | "HIGH" | "SEVERE";
  desc: string;
  photoUrl: string;
  status: "PENDING_REVIEW" | "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM";
  time: string;
  aiCorrelationScore?: number;
  aiCorrelationNote?: string;
}

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: CitizenReportData) => void;
  lang: Language;
}

// 3 Realistic Ground Hazard Samples for 1-Click Instant Demo
const SAMPLE_PRESET_PHOTOS = [
  {
    title: "Hill Slope Crack (Singtam)",
    hazard: "New Hill Fissure / Creep",
    district: "East Sikkim",
    state: "Sikkim",
    location: "Singtam Flank, NH-10 (Km 32)",
    lat: 27.23,
    lon: 88.50,
    severity: "SEVERE" as const,
    url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80",
    desc: "Active 4-inch tension fissure spreading across the upper slope cut above primary road."
  },
  {
    title: "Retaining Wall Bulge (Cherrapunji)",
    hazard: "Retaining Wall Bulging",
    district: "East Khasi Hills",
    state: "Meghalaya",
    location: "Sohra Escarpment Road",
    lat: 25.28,
    lon: 91.73,
    severity: "HIGH" as const,
    url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    desc: "Concrete road culvert retaining wall tilting outward with muddy spring water seepage."
  },
  {
    title: "Mudflow Debris Choke (Diphu)",
    hazard: "Debris Mudflow Choking Highway",
    district: "Karbi Anglong",
    state: "Assam",
    location: "Diphu-Lumding Hill Cut (Km 18)",
    lat: 25.84,
    lon: 93.44,
    severity: "SEVERE" as const,
    url: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?auto=format&fit=crop&w=600&q=80",
    desc: "Sludge and saturated gravel sliding down embankment directly obstructing one traffic lane."
  }
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  lang
}) => {
  const t = translations[lang];

  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(SAMPLE_PRESET_PHOTOS[0].url);
  const [hazardType, setHazardType] = useState("New Hill Fissure / Creep");
  const [district, setDistrict] = useState("East Sikkim");
  const [stateName, setStateName] = useState("Sikkim");
  const [locationName, setLocationName] = useState("Singtam Flank, NH-10");
  const [lat, setLat] = useState(27.23);
  const [lon, setLon] = useState(88.50);
  const [severity, setSeverity] = useState<"MODERATE" | "HIGH" | "SEVERE">("SEVERE");
  const [description, setDescription] = useState(SAMPLE_PRESET_PHOTOS[0].desc);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local file upload (converts to Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setCustomPhotoUrl(reader.result as string);
        setSelectedPresetIndex(null);
        setUploadFeedback(`Selected file: ${file.name}`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick Preset Selection
  const applyPreset = (index: number) => {
    const preset = SAMPLE_PRESET_PHOTOS[index];
    setSelectedPresetIndex(index);
    setCustomPhotoUrl(preset.url);
    setHazardType(preset.hazard);
    setDistrict(preset.district);
    setStateName(preset.state);
    setLocationName(preset.location);
    setLat(preset.lat);
    setLon(preset.lon);
    setSeverity(preset.severity);
    setDescription(preset.desc);
    setUploadFeedback(`Applied sample: ${preset.title}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reportId = Math.floor(500 + Math.random() * 400);

    const newReport: CitizenReportData = {
      id: reportId,
      reporter: reporterName.trim() || "Field Observer / Citizen",
      phone: reporterPhone.trim() || "+91-98XXX-XXXXX",
      location: `${locationName}, ${district}`,
      district: district,
      state: stateName,
      lat: lat,
      lon: lon,
      hazard: hazardType,
      severity: severity,
      desc: description,
      photoUrl: customPhotoUrl,
      status: "PENDING_REVIEW",
      time: "Just now",
      aiCorrelationScore: severity === "SEVERE" ? 0.92 : severity === "HIGH" ? 0.78 : 0.54,
      aiCorrelationNote: `Ground observation coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)}) align with GSI Susceptibility Zone (${district}). Recent 48h rainfall exceeds slope failure threshold.`
    };

    setTimeout(() => {
      onSubmitReport(newReport);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0e1424] border border-gray-700 shadow-2xl p-5 sm:p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wide text-white">
                {t.reportModalTitle}
              </h3>
              <p className="text-xs text-gray-400">
                Geo-tagged Ground Observation &bull; Instant Early Warning Map Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Photo Selection: Upload File OR Pick Quick Sample */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              {t.uploadPhoto}
            </label>

            {/* Quick Sample Selector Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-gray-400 shrink-0 font-medium">Demo Samples:</span>
              {SAMPLE_PRESET_PHOTOS.map((preset, idx) => (
                <button
                  type="button"
                  key={preset.title}
                  onClick={() => applyPreset(idx)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition shrink-0 ${
                    selectedPresetIndex === idx
                      ? "bg-sky-600 text-white border-sky-400 font-bold shadow-md shadow-sky-600/30"
                      : "bg-slate-900/80 text-gray-400 border-gray-700 hover:text-white hover:border-gray-600"
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>

            {/* Photo Preview & Custom Upload Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Image Preview Box */}
              <div className="relative h-44 rounded-xl border border-gray-700 bg-slate-950 overflow-hidden flex items-center justify-center group shadow-inner">
                {customPhotoUrl ? (
                  <img
                    src={customPhotoUrl}
                    alt="Hazard Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-sky-300 font-mono">
                  {severity} HAZARD
                </div>
              </div>

              {/* Upload Input */}
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-700 hover:border-sky-500 rounded-xl bg-slate-900/50 cursor-pointer p-4 text-center transition group">
                  <Upload className="w-8 h-8 text-sky-400 group-hover:-translate-y-1 transition duration-200 mb-2" />
                  <span className="text-xs font-bold text-gray-200">
                    Click to browse your device
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    Supports JPG, PNG, WEBP from camera or gallery
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {uploadFeedback && (
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {uploadFeedback}
              </p>
            )}
          </div>

          {/* 2. Hazard Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Hazard Classification
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="New Hill Fissure / Creep">New Hill Fissure / Creep</option>
                <option value="Retaining Wall Bulging">Retaining Wall Failure / Bulging</option>
                <option value="Debris Mudflow Choking Highway">Debris Mudflow Choking Highway</option>
                <option value="Active Rockfall / Boulder Rolling">Active Rockfall / Boulder Rolling</option>
                <option value="Road Embankment Subsidence">Road Embankment Subsidence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Reported Severity
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["MODERATE", "HIGH", "SEVERE"] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setSeverity(lvl)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                      severity === lvl
                        ? lvl === "SEVERE"
                          ? "bg-rose-600 text-white border-rose-400"
                          : lvl === "HIGH"
                          ? "bg-amber-600 text-white border-amber-400"
                          : "bg-emerald-600 text-white border-emerald-400"
                        : "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Location / Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Sector / District
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Singtam Flank, NH-10"
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Latitude (°N)
              </label>
              <input
                type="number"
                step="0.001"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Longitude (°E)
              </label>
              <input
                type="number"
                step="0.001"
                value={lon}
                onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
                required
              />
            </div>
          </div>

          {/* 4. Description */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Field Observation Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe width of crack, muddy water flow, or threatening structures..."
              className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 leading-relaxed"
              required
            ></textarea>
          </div>

          {/* 5. Reporter Name & Contact (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Reporter Name (Optional)
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Ramesh Kalita (Local Panchayat Scout)"
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Emergency Mobile # (For verification)
              </label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+91-98XXX-XXXXX"
                className="w-full bg-slate-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-gray-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-gray-300 hover:text-white border border-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white transition shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Syncing to Early Warning Map...</span>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>Submit Ground Report to Map</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
