"use client";

import type { ReactNode } from "react";
import { useUserState } from "@/hooks/use-user-state";

/**
 * Renders children only once stored user state has loaded, so screens that
 * seed form state from it start with the real values, not the defaults.
 */
export function Hydrated({ children }: { children: ReactNode }) {
  const [, , { hydrated }] = useUserState();
  return hydrated ? <>{children}</> : null;
}
