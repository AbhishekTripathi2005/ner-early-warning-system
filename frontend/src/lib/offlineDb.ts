// IndexedDB Storage Layer for Offline / Low-Network Field Operations (SIH 2026)
// Provides zero-dependency native persistence for map data, alerts, and offline hazard queues.

const DB_NAME = "ner_early_warning_offline_db";
const DB_VERSION = 1;

export interface QueuedCitizenReport {
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
  status: "PENDING_REVIEW" | "VERIFIED_TRUE_ALARM" | "DISMISSED_FALSE_ALARM";
  time: string;
  timestamp: number;
  aiCorrelationScore?: number;
  aiCorrelationNote?: string;
  isOfflineQueued: boolean;
  slope?: number;
  rain48?: number;
  soil?: number;
  insar?: number;
  elevation?: number;
  isLiveTelemetry?: boolean;
  telemetrySource?: string;
}

export interface OfflineFeedbackLog {
  id: string;
  alertId: number;
  alertTitle: string;
  feedbackType: "CONFIRMED" | "FALSE_ALARM" | "MISSED_EVENT";
  officerName: string;
  officerBadge: string;
  notes: string;
  observedRainfall?: number;
  timestamp: number;
  synced: boolean;
}

class OfflineDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !("indexedDB" in window)) {
        return reject(new Error("IndexedDB not supported"));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;

        // 1. Store for offline-queued citizen hazard reports
        if (!db.objectStoreNames.contains("pending_reports")) {
          const store = db.createObjectStore("pending_reports", { keyPath: "id" });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }

        // 2. Store for cached alerts
        if (!db.objectStoreNames.contains("cached_alerts")) {
          db.createObjectStore("cached_alerts", { keyPath: "id" });
        }

        // 3. Store for cached road statuses
        if (!db.objectStoreNames.contains("cached_roads")) {
          db.createObjectStore("cached_roads", { keyPath: "id" });
        }

        // 4. Store for officer continuous learning feedback
        if (!db.objectStoreNames.contains("feedback_logs")) {
          db.createObjectStore("feedback_logs", { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- Citizen Reports Queue ---
  async queueReport(report: QueuedCitizenReport): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("pending_reports", "readwrite");
      const store = tx.objectStore("pending_reports");
      store.put(report);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getQueuedReports(): Promise<QueuedCitizenReport[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("pending_reports", "readonly");
      const store = tx.objectStore("pending_reports");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async removeQueuedReport(id: number): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("pending_reports", "readwrite");
      const store = tx.objectStore("pending_reports");
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clearQueuedReports(): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("pending_reports", "readwrite");
      const store = tx.objectStore("pending_reports");
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // --- Officer Continuous Learning Feedback Logs ---
  async saveFeedback(feedback: OfflineFeedbackLog): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("feedback_logs", "readwrite");
      const store = tx.objectStore("feedback_logs");
      store.put(feedback);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getFeedbackLogs(): Promise<OfflineFeedbackLog[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("feedback_logs", "readonly");
      const store = tx.objectStore("feedback_logs");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Cached Alerts & Roads ---
  async cacheAlerts(alerts: any[]): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("cached_alerts", "readwrite");
      const store = tx.objectStore("cached_alerts");
      alerts.forEach((alert) => store.put(alert));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getCachedAlerts(): Promise<any[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("cached_alerts", "readonly");
      const store = tx.objectStore("cached_alerts");
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineDb = new OfflineDB();
