"use client";

import { useRouter } from "next/navigation";
import { Button, Typography } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useUserState } from "@/hooks/use-user-state";
import { IconCheck, IconLocate } from "@/components/icons";

const PROMISES = [
  "Used only while the app is open",
  "Never stored on our servers",
  "Never shared with the masjids or anyone else",
];

export default function LocationPage() {
  const router = useRouter();
  const [, update] = useUserState();

  function allowLocation() {
    // One-shot request at the point of need — never on load. With no
    // backend yet the result isn't stored; the flow continues either way.
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          update({ locationDenied: false });
          router.push("/follow-masjids");
        },
        () => {
          update({ locationDenied: true });
          router.push("/follow-masjids");
        },
        { timeout: 10_000 }
      );
    } else {
      update({ locationDenied: true });
      router.push("/follow-masjids");
    }
  }

  return (
    <OnboardingScreen
      back
      backHref="/profile-setup"
      step="Step 2 of 3"
      footer={
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={allowLocation}
          >
            Allow location
          </Button>
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onPress={() => {
              update({ locationDenied: true });
              router.push("/follow-masjids");
            }}
          >
            Not now — I’ll pick by area
          </Button>
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-8 px-6 pb-10">
        <div className="flex flex-col gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-accent-soft text-accent-soft-foreground">
            <IconLocate size={32} />
          </span>
          <Typography.Heading level={2}>Masjids near you</Typography.Heading>
          <Typography.Paragraph className="text-muted">
            Turn on location and we’ll sort masjids by how far you’d have to
            walk, so the closest jamaat is always first.
          </Typography.Paragraph>
        </div>

        <div className="flex flex-col gap-3.5 rounded-3xl border border-black/5 shadow-premium bg-surface p-4">
          {PROMISES.map((promise) => (
            <div key={promise} className="flex items-start gap-3">
              <span className="mt-0.5 flex-none text-accent">
                <IconCheck size={20} />
              </span>
              <Typography.Paragraph>{promise}</Typography.Paragraph>
            </div>
          ))}
        </div>
      </div>
    </OnboardingScreen>
  );
}
