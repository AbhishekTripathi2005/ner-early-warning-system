"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw, CheckCircle, Database } from "lucide-react";
import { offlineDb, QueuedCitizenReport } from "../../lib/offlineDb";

interface OfflineStatusBadgeProps {
  onSyncReports?: (syncedReports: QueuedCitizenReport[]) => void;
}

export const OfflineStatusBadge: React.FC<OfflineStatusBadgeProps> = ({ onSyncReports }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [justSyncedCount, setJustSyncedCount] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Check pending reports count
  const refreshPendingCount = async () => {
    try {
      const reports = await offlineDb.getQueuedReports();
      setPendingCount(reports.length);
    } catch (e) {
      // IndexedDB might not be ready yet
    }
  };

  // Perform synchronization of queued reports
  const triggerSync = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      const pending = await offlineDb.getQueuedReports();
      if (pending.length > 0) {
        if (onSyncReports) {
          onSyncReports(pending);
        }
        await offlineDb.clearQueuedReports();
        setJustSyncedCount(pending.length);
        setPendingCount(0);
        setTimeout(() => setJustSyncedCount(null), 5000);
      }
    } catch (err) {
      console.error("Error during auto-sync:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);
    refreshPendingCount();

    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      refreshPendingCount();
    };

    // Listen for custom trigger from service worker background sync
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "TRIGGER_OFFLINE_SYNC") {
        triggerSync();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    navigator.serviceWorker?.addEventListener("message", handleServiceWorkerMessage);

    const interval = setInterval(refreshPendingCount, 4000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker?.removeEventListener("message", handleServiceWorkerMessage);
      clearInterval(interval);
    };
  }, []);

  // 1. If currently Offline: Show prominent high-visibility warning banner
  if (!isOnline) {
    return (
      <div className="w-full bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-950 border border-amber-500/50 rounded-xl p-3 shadow-lg shadow-amber-950/40 text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-in fade-in duration-300">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-amber-300">OFFLINE FIELD MODE ACTIVE: </span>
            <span className="text-amber-200/90">
              Operating from cached Esri GIS tiles & local telemetry.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 text-xs">
          <span className="bg-black/50 px-2.5 py-1 rounded-md border border-amber-500/30 text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
            <Database className="w-3 h-3 text-amber-400" />
            <span>Queued Reports: <b>{pendingCount}</b></span>
          </span>
          <span className="text-[10px] text-amber-300/70 uppercase tracking-wider">
            Auto-syncs on reconnect
          </span>
        </div>
      </div>
    );
  }

  // 2. If just synced: Show green confirmation pill
  if (justSyncedCount !== null && justSyncedCount > 0) {
    return (
      <div className="w-full bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-2.5 text-emerald-300 text-xs flex items-center justify-between shadow-md animate-in slide-in-from-top duration-300">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>
            <b>Reconnected & Auto-Synced:</b> Successfully uploaded {justSyncedCount} offline citizen hazard reports to early warning map!
          </span>
        </div>
        <button
          onClick={() => setJustSyncedCount(null)}
          className="text-emerald-400 hover:text-white text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-900/40 border border-emerald-600/30"
        >
          Dismiss
        </button>
      </div>
    );
  }

  // 3. Online with pending queue (e.g. initial reconnection waiting sync)
  if (pendingCount > 0) {
    return (
      <div className="w-full bg-sky-950/40 border border-sky-500/40 rounded-xl p-2.5 text-sky-300 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wifi className="w-4 h-4 text-sky-400" />
          <span>{pendingCount} offline reports pending upload to central server.</span>
        </div>
        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
        </button>
      </div>
    );
  }

  // When online and everything synced, no invasive banner needed
  return null;
};
