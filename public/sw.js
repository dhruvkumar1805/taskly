// Minimal service worker: installable-app support + a real offline page
// instead of the browser's connection-error screen. Deliberately does NOT
// cache authenticated HTML (dashboard/task data) — that would risk serving
// stale or cross-account content on a shared device. Full offline task
// creation/editing would need a local write queue + background sync; that's
// a separate, larger project, not attempted here.

const CACHE_VERSION = "v1";
const STATIC_CACHE = `taskly-static-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [OFFLINE_URL, "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Page navigations: always go to the network (dashboard content is
  // per-user and must stay fresh); fall back to the offline page only if
  // the network is unreachable.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Next.js build assets are content-hashed and immutable — safe to cache
  // aggressively for speed and offline reuse.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
  }
});
