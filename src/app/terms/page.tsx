"use client";

import { Typography } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";

export default function TermsPage() {
  return (
    <OnboardingScreen back backHref="/continue-with">
      <div className="flex flex-1 flex-col gap-4 px-6 pt-2">
        <Typography.Heading level={2}>Terms</Typography.Heading>
        <Typography.Paragraph className="text-muted">
          The full text is still being written. Until it is, MasjidLove stores
          nothing about you outside this device.
        </Typography.Paragraph>
      </div>
    </OnboardingScreen>
  );
}
