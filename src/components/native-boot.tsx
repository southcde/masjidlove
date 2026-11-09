"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useIsDark } from "@/hooks/use-is-dark";
import { hideSplash, onDeepLink, setStatusBar } from "@/services/native";

/**
 * Wires the native shell to the app: hides the splash once the first screen
 * has painted, keeps the status bar in step with the theme, and sends deep
 * links through the Next router. Renders nothing; a no-op in the browser.
 */
export function NativeBoot() {
  const router = useRouter();
  const dark = useIsDark();

  useEffect(() => {
    // Two frames: let the first screen paint before the splash fades.
    const id = requestAnimationFrame(() => requestAnimationFrame(() => void hideSplash()));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    void setStatusBar(dark);
  }, [dark]);

  useEffect(() => onDeepLink((path) => router.push(path)), [router]);

  return null;
}
