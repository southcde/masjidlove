"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserState } from "@/hooks/use-user-state";

/** Sends visitors who haven't finished onboarding back to the welcome screen. */
export function useOnboardingGuard() {
  const router = useRouter();
  const [state, , { hydrated }] = useUserState();
  useEffect(() => {
    if (hydrated && !state.onboardingComplete) router.replace("/");
  }, [hydrated, state.onboardingComplete, router]);
}
