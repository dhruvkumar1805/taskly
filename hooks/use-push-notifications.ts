"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "@/app/actions/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    let cancelled = false;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((sub) => {
        if (cancelled) return;
        setSupported(true);
        setSubscribed(!!sub);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const enable = useCallback(async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    const json = subscription.toJSON();
    await subscribeToPush({
      endpoint: json.endpoint!,
      keys: { p256dh: json.keys!.p256dh, auth: json.keys!.auth },
    });
    setSubscribed(true);
  }, []);

  const disable = useCallback(async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await unsubscribeFromPush(subscription.endpoint);
      await subscription.unsubscribe();
    }
    setSubscribed(false);
  }, []);

  return { supported, subscribed, enable, disable };
}
