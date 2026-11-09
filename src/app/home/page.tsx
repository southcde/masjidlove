"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Alert, Avatar, AvatarFallback, Button, Chip } from "@heroui/react";
import { LinkButton } from "@/components/link-button";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { TabBar } from "@/components/app/tab-bar";
import { useUserState } from "@/hooks/use-user-state";
import { initialsOf, type Event, type Rsvp } from "@/types";
import { formatTravel, getMasjid } from "@/services/masjids";
import { listEvents } from "@/services/events";
import { IconBell, IconCheck, IconChevronRight, IconClock } from "@/components/icons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function eventDateLabel(event: Event): string {
  const date = new Date(`${event.date}T00:00:00`);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function HomeEventCard({ event, myRsvp }: { event: Event; myRsvp?: Rsvp }) {
  const masjid = getMasjid(event.masjidId);
  const rsvp = myRsvp;
  return (
    <Link
      href={`/events/${event.id}`}
      className="block overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--surface-shadow)] active:bg-default"
    >
      <div className="relative h-[106px] bg-default" aria-hidden />
      <div className="flex flex-col gap-2 p-3.5">
        <div className="flex items-center gap-2">
          <Chip
            variant="secondary"
            className="bg-accent-soft text-[12.5px] font-semibold text-accent-soft-foreground"
          >
            {eventDateLabel(event)} · {event.time}
          </Chip>
          {event.kind && (
            <span className="text-[12.5px] text-muted">{event.kind}</span>
          )}
        </div>
        <div className="text-[16.5px] font-semibold leading-tight">
          {event.title}
        </div>
        <div className="text-[13px] text-muted">
          {masjid?.name}, {masjid?.area} · {masjid && formatTravel(masjid)}
        </div>
        <div className="flex items-center gap-2.5 pt-0.5">
          {rsvp === "going" ? (
            <Chip
              variant="secondary"
              className="gap-1 bg-accent-soft px-2.5 py-1.5 text-[13px] font-semibold text-accent-soft-foreground"
            >
              <IconCheck size={15} />
              Going
            </Chip>
          ) : (
            <span className="rounded-[9px] bg-default px-2.5 py-1.5 text-[13px] font-semibold text-default-foreground">
              RSVP
            </span>
          )}
          <span className="text-[13px] text-muted">
            {event.goingCount} going
          </span>
        </div>
      </div>
    </Link>
  );
}

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function useOnline() {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true
  );
}

export default function HomePage() {
  useOnboardingGuard();
  const online = useOnline();
  const [state] = useUserState();
  const firstName = state.name.split(" ")[0] || "there";
  const initials = initialsOf(state.name) || "ML";

  const isEmpty = state.followedMasjidIds.length === 0;
  const homeMasjidId = state.followedMasjidIds[0] ?? "masjidul-quds";
  const masjid = getMasjid(homeMasjidId);

  const events = listEvents(state.customEvents).slice(0, 2);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 pt-1">
        <header className="flex items-center gap-3">
          <Avatar className="h-11 w-11 flex-none">
            <AvatarFallback className="text-[15px] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="text-[13px] text-muted">Asalamu Alaykum</span>
            <span className="text-[19px] font-semibold tracking-[-0.01em]">
              {firstName}
            </span>
          </div>
          <Link
            href="/notifications"
            aria-label="Notification settings"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-foreground"
          >
            <IconBell size={24} />
            {/* Badge dot — shown while events are unread; mock */}
            <span className="absolute right-[9px] top-[9px] h-[9px] w-[9px] rounded-full border-2 border-background bg-accent" />
          </Link>
        </header>

        {!online && (
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>You’re offline</Alert.Title>
              <Alert.Description>
                What you see may have changed since you last had a connection.
              </Alert.Description>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 self-start"
                onPress={() => window.location.reload()}
              >
                Try again
              </Button>
            </Alert.Content>
          </Alert>
        )}

        {isEmpty ? (
          <section
            aria-label="Follow a masjid"
            className="flex flex-1 flex-col justify-center gap-4 pb-10"
          >
            <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.01em]">
              Follow a masjid to see what’s on
            </h1>
            <p className="text-[15.5px] leading-snug text-muted">
              Pick the masjid you pray at and its events and jamaat times land
              here every day.
            </p>
            <LinkButton href="/explore" variant="primary" size="lg" fullWidth>
              Find masjids near me
            </LinkButton>
            <LinkButton href="/explore" variant="ghost" size="lg" fullWidth>
              Search by area instead
            </LinkButton>
          </section>
        ) : (
          <>
        <section
          aria-label="Next salah"
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3.5 py-3"
        >
          <span className="flex-none text-muted">
            <IconClock size={20} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="text-[15.5px]">
              <span className="font-semibold">Dhuhr 13:15</span>
              <span className="text-muted"> · in 1 h 42 m</span>
            </span>
            <span className="text-[13px] text-muted">
              {masjid?.name} · {masjid && formatTravel(masjid)}
            </span>
          </div>
          <Link
            href={`/masjid/${homeMasjidId}/jamaat`}
            className="flex items-center gap-0.5 text-[13.5px] font-medium text-accent"
          >
            All times
            <IconChevronRight size={16} />
          </Link>
        </section>

        <section aria-label="This week near you" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[19px] font-semibold tracking-[-0.01em]">
              This week near you
            </span>
            <Link
              href="/events"
              className="text-[13.5px] font-medium text-accent"
            >
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <HomeEventCard
                key={event.id}
                event={event}
                myRsvp={state.rsvps[event.id]}
              />
            ))}
          </div>
        </section>
          </>
        )}
      </main>
      <TabBar active="home" />
    </div>
  );
}
