"use client";

import Link from "next/link";
import { Typography } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useUserState } from "@/hooks/use-user-state";
import { getMasjid } from "@/services/masjids";
import { IconCalendar, IconChevronRight, IconClock } from "@/components/icons";

const ACTIONS = [
  {
    href: "/admin/times",
    title: "Edit this week’s times",
    note: "Change a jamaat time and notify followers",
    Icon: IconClock,
  },
  {
    href: "/admin/events/new",
    title: "Post an event",
    note: "Classes, talks, volunteering days",
    Icon: IconCalendar,
  },
] as const;

export default function AdminPage() {
  const [state] = useUserState();
  const masjid = getMasjid(state.followedMasjidIds[0] ?? "masjidul-quds");

  return (
    <OnboardingScreen back backHref="/profile">
      <div className="flex flex-1 flex-col gap-6 px-4 pt-2">
        <div className="flex flex-col gap-1.5 px-1">
          <Typography.Heading level={2}>Masjid admin</Typography.Heading>
          <Typography.Paragraph className="text-muted">
            {masjid?.name} · {masjid?.area}
          </Typography.Paragraph>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {ACTIONS.map(({ href, title, note, Icon }, index) => (
            <div key={href}>
              {index > 0 && <div className="ml-4 h-px bg-separator" />}
              <Link
                href={href}
                className="flex min-h-[64px] items-center gap-3 px-4 py-3 active:bg-default"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
                  <Icon size={20} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="text-[15.5px] font-medium">{title}</span>
                  <span className="text-[13px] text-muted">{note}</span>
                </span>
                <IconChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </OnboardingScreen>
  );
}
