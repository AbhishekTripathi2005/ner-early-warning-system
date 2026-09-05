// Service Worker for NER Landslide Early Warning System (SIH 2026)
const CACHE_NAME = "ner-ews-shell-v1";
const TILE_CACHE_NAME = "esri-tiles-cache-v1";

const STATIC_PRECACHE = [
  "/",
  "/favicon.ico"
];

// Install: Precache basic app shell
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn("[SW] Precache skipped for some dynamic assets:", err);
      });
    })
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== TILE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy for Map Tiles & App Assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. Esri Map Tiles (Stale-While-Revalidate / Cache First for offline GIS viewing)
  if (
    url.hostname.includes("arcgisonline.com") ||
    url.hostname.includes("arcgis.com") ||
    url.hostname.includes("tile.openstreetmap.org")
  ) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return new Response("", { status: 503, statusText: "Offline tile unavailable" });
        }
      })
    );
    return;
  }

  // 2. Next.js Static Chunks, Images, Fonts & CSS (Cache First)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        }).catch(() => {
          return new Response("", { status: 404 });
        });
      })
    );
    return;
  }

  // 3. HTML Navigation / API requests: Network First with offline fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (event.request.method === "GET" && response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") {
          return (await caches.match("/")) || new Response("Offline Mode: Telemetry Cached Locally.", {
            headers: { "Content-Type": "text/html" }
          });
        }
        return new Response(JSON.stringify({ offline: true, message: "Operating in offline field mode." }), {
          headers: { "Content-Type": "application/json" }
        });
      })
  );
});

// Background Sync for offline queued reports
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-hazard-reports") {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "TRIGGER_OFFLINE_SYNC" });
        });
      })
    );
  }
});
