"use client";

import { useEffect } from "react";
import { isNative } from "@/services/native";

export function RegisterServiceWorker() {
  useEffect(() => {
    // The native app bundles its own files; a service worker would only add a stale cache.
    if (isNative()) return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return null;
}
