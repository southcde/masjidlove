"use client";

import { useEffect } from "react";
import { useUserState } from "@/hooks/use-user-state";

const ZOOM = { default: "1", large: "1.08", larger: "1.16" } as const;

/**
 * Applies the user's appearance settings to <html>. Renders nothing. The
 * inline script in layout.tsx sets the first paint; this keeps it in step
 * afterwards and follows the OS when the choice is "system".
 */
export function ThemeApplier() {
  const [state, , { hydrated }] = useUserState();
  const { theme, textSize, reduceMotion } = state.settings;

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      root.dataset.theme = dark ? "dark" : "light";
      root.classList.toggle("dark", dark);
      root.classList.toggle("light", !dark);
      root.style.colorScheme = dark ? "dark" : "light";
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", dark ? "#0e1512" : "#ffffff");
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [hydrated, theme]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.style.setProperty("--app-zoom", ZOOM[textSize]);
    root.dataset.reduceMotion = reduceMotion ? "true" : "false";
  }, [hydrated, textSize, reduceMotion]);

  return null;
}
