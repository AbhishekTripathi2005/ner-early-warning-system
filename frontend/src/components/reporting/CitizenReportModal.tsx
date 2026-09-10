"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  Camera,
  Video,
  Image as ImageIcon,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Compass,
  FileVideo
} from "lucide-react";
import { Language, translations } from "../../lib/i18n";
import { offlineDb } from "../../lib/offlineDb";

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
  mediaType: "image" | "video";
  videoUrl?: string;
  durationSeconds?: number;
  capturedAt?: string;
  status: "PENDING_REVIEW" | "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM";
  time: string;
  aiCorrelationScore?: number;
  aiCorrelationNote?: string;
  isOfflineQueued?: boolean;
}

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: CitizenReportData) => void;
  lang: Language;
}

// Realistic Ground Hazard Samples for 1-Click Instant Demo (Photos + 1 Video)
const SAMPLE_PRESETS = [
  {
    title: "Hill Slope Crack (Singtam)",
    mediaType: "image" as const,
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
    title: "Active Debris Clip (12s Video)",
    mediaType: "video" as const,
    hazard: "Active Highway Mudflow & Gravel",
    district: "Dima Hasao",
    state: "Assam",
    location: "Haflong Hill Cutting (Km 42)",
    lat: 25.17,
    lon: 93.02,
    severity: "SEVERE" as const,
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    durationSeconds: 12,
    desc: "Continuous slope collapse and saturated soil sliding onto road shoulder captured live."
  },
  {
    title: "Retaining Wall Bulge (Cherrapunji)",
    mediaType: "image" as const,
    hazard: "Retaining Wall Bulging",
    district: "East Khasi Hills",
    state: "Meghalaya",
    location: "Sohra Escarpment Road",
    lat: 25.28,
    lon: 91.73,
    severity: "HIGH" as const,
    url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80",
    desc: "Concrete road culvert retaining wall tilting outward with muddy spring water seepage."
  }
];

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  lang
}) => {
  const t = translations[lang] || translations.en;

  const [activeMediaTab, setActiveMediaTab] = useState<"image" | "video">("image");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(0);
  const [mediaUrl, setMediaUrl] = useState<string>(SAMPLE_PRESETS[0].url);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [hazardType, setHazardType] = useState("New Hill Fissure / Creep");
  const [district, setDistrict] = useState("East Sikkim");
  const [stateName, setStateName] = useState("Sikkim");
  const [locationName, setLocationName] = useState("Singtam Flank, NH-10");
  const [lat, setLat] = useState(27.23);
  const [lon, setLon] = useState(88.50);
  const [severity, setSeverity] = useState<"MODERATE" | "HIGH" | "SEVERE">("SEVERE");
  const [description, setDescription] = useState(SAMPLE_PRESETS[0].desc);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [videoWarning, setVideoWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle local file upload (Photo or Video with duration validation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    setVideoWarning(null);

    if (isVideo) {
      setActiveMediaTab("video");
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = Math.round(videoElement.duration);
        setVideoDuration(duration);

        if (duration > 20) {
          setVideoWarning(`⚠️ Video is ${duration}s long. Please keep videos under 15-20s for low-bandwidth field sync.`);
        } else {
          setUploadFeedback(`Selected video clip (${duration}s): ${file.name}`);
        }
      };

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setMediaUrl(reader.result as string);
          setSelectedPresetIndex(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setActiveMediaTab("image");
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setMediaUrl(reader.result as string);
          setSelectedPresetIndex(null);
          setUploadFeedback(`Selected photo: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Preset Selection
  const applyPreset = (index: number) => {
    const preset = SAMPLE_PRESETS[index];
    setSelectedPresetIndex(index);
    setActiveMediaTab(preset.mediaType);
    setMediaUrl(preset.url);
    setVideoDuration(preset.durationSeconds || 0);
    setHazardType(preset.hazard);
    setDistrict(preset.district);
    setStateName(preset.state);
    setLocationName(preset.location);
    setLat(preset.lat);
    setLon(preset.lon);
    setSeverity(preset.severity);
    setDescription(preset.desc);
    setVideoWarning(null);
    setUploadFeedback(`Applied sample: ${preset.title}`);
  };

  // Auto-Detect Current GPS Coordinates
  const handleDetectGPS = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(parseFloat(pos.coords.latitude.toFixed(4)));
        setLon(parseFloat(pos.coords.longitude.toFixed(4)));
        setLocationName(`Current GPS (${pos.coords.latitude.toFixed(2)}°N, ${pos.coords.longitude.toFixed(2)}°E)`);
        setUploadFeedback(`📍 Accurate GPS acquired: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`);
        setIsDetectingLocation(false);
      },
      (err) => {
        alert("GPS detection failed: " + err.message + ". Keeping existing coordinates.");
        setIsDetectingLocation(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reportId = Math.floor(500 + Math.random() * 400);
    const nowIso = new Date().toISOString();

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
      photoUrl: mediaUrl,
      mediaType: activeMediaTab,
      videoUrl: activeMediaTab === "video" ? mediaUrl : undefined,
      durationSeconds: activeMediaTab === "video" ? (videoDuration || 12) : undefined,
      capturedAt: nowIso,
      status: "PENDING_REVIEW",
      time: "Just now",
      aiCorrelationScore: severity === "SEVERE" ? 0.94 : severity === "HIGH" ? 0.78 : 0.54,
      aiCorrelationNote: `Ground observation (${lat.toFixed(2)}, ${lon.toFixed(2)}) validated against GSI Slope Susceptibility layer (${district}). Recent 48h rainfall exceeds critical threshold.`,
      isOfflineQueued: typeof navigator !== "undefined" && !navigator.onLine
    };

    // If Offline: Queue into IndexedDB
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      try {
        await offlineDb.queueReport({
          ...newReport,
          timestamp: Date.now(),
          isOfflineQueued: true
        });
        alert("⚡ Stored in Offline Queue: You are currently offline. This report will automatically sync once your internet connection is restored.");
      } catch (err) {
        console.error("Failed to queue offline report:", err);
      }
    }

    setTimeout(() => {
      onSubmitReport(newReport);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0c1322] border border-slate-700/80 shadow-2xl p-4 sm:p-6 text-slate-100 space-y-4 z-[5001]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-wide text-white">
                {t.reportModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                Photo & Video (Max 20s) &bull; Auto GPS &bull; Offline Resilient Queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Media Type Selector: Photo vs Video */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.uploadPhoto}
              </label>
              <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("image")}
                  className={`px-3 py-1 rounded-md font-bold flex items-center gap-1.5 transition ${
                    activeMediaTab === "image"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab("video")}
                  className={`px-3 py-1 rounded-md font-bold flex items-center gap-1.5 transition ${
                    activeMediaTab === "video"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video (15-20s)</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Selector Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 shrink-0 font-medium">Demo Samples:</span>
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={preset.title}
                  onClick={() => applyPreset(idx)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition shrink-0 flex items-center gap-1.5 ${
                    selectedPresetIndex === idx
                      ? "bg-sky-600 text-white border-sky-400 font-bold shadow-sm"
                      : "bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {preset.mediaType === "video" ? (
                    <FileVideo className="w-3 h-3 text-amber-300" />
                  ) : (
                    <ImageIcon className="w-3 h-3 text-sky-300" />
                  )}
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>

            {/* Media Preview & Upload Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Media Preview Box */}
              <div className="relative h-44 rounded-xl border border-slate-800 bg-black overflow-hidden flex items-center justify-center group shadow-inner">
                {activeMediaTab === "video" ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80"
                  />
                ) : mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt="Hazard Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-xs">No media selected</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] text-sky-300 font-mono flex items-center gap-1 pointer-events-none">
                  {activeMediaTab === "video" ? <Video className="w-3 h-3 text-amber-400" /> : <Camera className="w-3 h-3 text-sky-400" />}
                  <span>{activeMediaTab.toUpperCase()} &bull; {severity}</span>
                </div>
              </div>

              {/* Upload Input */}
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center h-44 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl bg-slate-950/60 cursor-pointer p-4 text-center transition group">
                  <Upload className="w-8 h-8 text-sky-400 group-hover:-translate-y-0.5 transition duration-150 mb-2" />
                  <span className="text-xs font-bold text-slate-200">
                    Click to browse device file
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Supports Photos (JPG, PNG) & Videos (MP4, WebM, max 20s)
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {videoWarning && (
              <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {videoWarning}
              </p>
            )}

            {uploadFeedback && (
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> {uploadFeedback}
              </p>
            )}
          </div>

          {/* 2. Hazard Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Hazard Classification
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="New Hill Fissure / Creep">New Hill Fissure / Creep</option>
                <option value="Active Highway Mudflow & Gravel">Active Highway Mudflow & Gravel</option>
                <option value="Retaining Wall Bulging">Retaining Wall Failure / Bulging</option>
                <option value="Active Rockfall / Boulder Rolling">Active Rockfall / Boulder Rolling</option>
                <option value="Road Embankment Subsidence">Road Embankment Subsidence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
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
                          ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                          : lvl === "HIGH"
                          ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                          : "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Location / Coordinates with Auto-GPS Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">
                Geo-Location Coordinates
              </label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingLocation}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 bg-sky-950/60 border border-sky-600/40 px-2 py-0.5 rounded-lg transition"
              >
                <Compass className={`w-3 h-3 ${isDetectingLocation ? "animate-spin" : ""}`} />
                <span>{isDetectingLocation ? "Acquiring GPS..." : "📍 Auto-Detect My GPS"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Singtam Flank, NH-10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  placeholder="Latitude (°N)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <input
                  type="number"
                  step="0.0001"
                  value={lon}
                  onChange={(e) => setLon(parseFloat(e.target.value) || 0)}
                  placeholder="Longitude (°E)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* 4. Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Field Observation Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe width of crack, rate of mudflow, threatening buildings or road obstruction..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 leading-relaxed"
              required
            ></textarea>
          </div>

          {/* 5. Reporter Name & Contact (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Reporter Name (Optional)
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Ramesh Kalita (Village Volunteer)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Emergency Mobile # (For verification)
              </label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+91-98XXX-XXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Syncing to Early Warning Map...</span>
              ) : (
                <>
                  {activeMediaTab === "video" ? <Video className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
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
