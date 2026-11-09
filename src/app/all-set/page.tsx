"use client";

import { Typography } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { LinkButton } from "@/components/link-button";
import { useUserState } from "@/hooks/use-user-state";
import { getMasjid } from "@/services/masjids";
import { listEvents } from "@/services/events";
import { IconCheck } from "@/components/icons";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function dayLabel(isoDate: string) {
  const date = new Date(`${isoDate}T00:00:00`);
  return {
    weekday: WEEKDAYS[date.getDay()],
    day: date.getDate(),
  };
}

export default function AllSetPage() {
  const [state] = useUserState();

  const followedNames = state.followedMasjidIds
    .map((id) => getMasjid(id)?.name)
    .filter(Boolean) as string[];

  const events = listEvents(state.customEvents).slice(0, 3);

  return (
    <OnboardingScreen>
      <div className="flex flex-1 flex-col justify-center gap-8 px-6 pb-10">
        <div className="flex flex-col gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-accent text-accent-foreground">
            <IconCheck size={34} />
          </span>
          <Typography.Heading level={2}>
            You’re all set{state.name ? `, ${state.name.split(" ")[0]}` : ""}
          </Typography.Heading>
          <Typography.Paragraph className="text-muted">
            {followedNames.length > 0 ? (
              <>
                Following{" "}
                <span className="font-medium text-foreground">
                  {followedNames.join(" and ")}
                </span>
                . Here’s what’s on this week.
              </>
            ) : (
              "You can follow masjids any time. Here’s what’s on this week."
            )}
          </Typography.Paragraph>
        </div>

        <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
          {events.map((event, index) => {
            const { weekday, day } = dayLabel(event.date);
            return (
              <div key={event.id}>
                {index > 0 && <div className="ml-4 h-px bg-separator" />}
                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex w-[46px] flex-none flex-col items-center">
                    <span className="text-xs font-medium text-muted">
                      {weekday}
                    </span>
                    <span className="text-[22px] font-semibold leading-tight">
                      {day}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15.5px] font-medium">
                      {event.title}
                    </span>
                    <span className="text-sm text-muted">
                      {event.time} · {getMasjid(event.masjidId)?.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <LinkButton href="/home" variant="primary" size="lg" fullWidth>
          Take me Home
        </LinkButton>
      </div>
    </OnboardingScreen>
  );
}
