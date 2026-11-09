"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LinkButton } from "@/components/link-button";
import { Hydrated } from "@/components/app/hydrated";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { PatternArt } from "@/components/app/pattern-art";
import { useUserState } from "@/hooks/use-user-state";
import { formatRand, KIND_COPY } from "@/services/giving";
import { IconHeart } from "@/components/icons";

function ThanksScreen() {
  const id = useSearchParams().get("id");
  const [state] = useUserState();
  const donation = state.donations.find((d) => d.id === id);

  return (
    <OnboardingScreen
      footer={
        <div className="flex flex-col gap-3">
          <LinkButton href="/support" variant="primary" size="lg" fullWidth>
            Done
          </LinkButton>
          <LinkButton href="/home" variant="ghost" size="lg" fullWidth>
            Back to Home
          </LinkButton>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-6 px-4 pb-6">
        <PatternArt
          tone="gold"
          scene="hands"
          className="anim-pop flex flex-col items-center gap-3 rounded-[32px] px-6 py-10 text-center text-white shadow-lift"
        >
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 backdrop-blur">
            <IconHeart size={30} />
          </span>
          <span className="font-display relative text-[34px] font-semibold leading-tight">
            Jazākallāhu khayran
          </span>
          {donation ? (
            <span className="relative text-[15px] text-white/90">
              {formatRand(donation.amount)}
              {donation.monthly ? " a month" : ""} to {donation.targetName}
            </span>
          ) : (
            <span className="relative text-[15px] text-white/90">
              Thank you for giving.
            </span>
          )}
        </PatternArt>
        <p className="px-2 text-center text-[15px] leading-relaxed text-muted">
          {donation ? `${KIND_COPY[donation.kind].title} — ` : ""}may Allah
          accept it from you and bless what you have left.
        </p>
        <p className="px-2 text-center text-[12.5px] leading-snug text-muted">
          Test build — this was recorded on your device only. No payment was
          taken.
        </p>
      </div>
    </OnboardingScreen>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={null}>
      <Hydrated>
        <ThanksScreen />
      </Hydrated>
    </Suspense>
  );
}
