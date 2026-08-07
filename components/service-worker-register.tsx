"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Dev-mode Next.js chunk URLs aren't stably content-hashed the way a
    // production build's are, so a cache-first service worker can serve a
    // stale bundle for a route you just changed. Only run it where that's
    // actually safe — and actively clean up a worker + cache left over from
    // before this guard existed, so an already-affected browser self-heals.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) reg.unregister();
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            if (key.startsWith("taskly-")) caches.delete(key);
          }
        });
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline support is a progressive enhancement — a failed
      // registration shouldn't be user-visible.
    });
  }, []);

  return null;
}
