"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Alert, Avatar, AvatarFallback, Button, Chip } from "@heroui/react";
import { LinkButton } from "@/components/link-button";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
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
      className="block overflow-hidden rounded-3xl bg-background shadow-premium ring-1 ring-black/5 transition-transform active:scale-[0.99]"
    >
      <PatternArt tone={toneFor(event.id)} className="h-[124px]">
        <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-semibold text-foreground backdrop-blur">
          {eventDateLabel(event)} · {event.time}
        </span>
        {event.kind && (
          <span className="absolute bottom-3 left-3.5 rounded-full bg-black/25 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur">
            {event.kind}
          </span>
        )}
      </PatternArt>
      <div className="flex flex-col gap-2 p-4">
        <div className="font-display text-[19px] font-semibold leading-tight">
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
            <span className="rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-accent-foreground">
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
  const firstName = state.name.split(" ")[0];
  const initials = initialsOf(state.name) || "ML";

  const isEmpty = state.followedMasjidIds.length === 0;
  const homeMasjidId = state.followedMasjidIds[0] ?? "masjidul-quds";
  const masjid = getMasjid(homeMasjidId);

  const events = listEvents(state.customEvents).slice(0, 2);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col overflow-y-auto pb-4">
        <PatternArt className="rounded-b-[32px] px-5 pb-16 pt-6">
          <header className="relative flex items-center gap-3.5">
            <Avatar className="h-12 w-12 flex-none ring-2 ring-gold">
              <AvatarFallback className="!bg-white/20 text-[16px] font-semibold !text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[13px] text-white/70">Asalamu Alaykum</span>
              {firstName && (
                <span className="font-display text-[24px] font-semibold leading-tight text-white">
                  {firstName}
                </span>
              )}
            </div>
            <Link
              href="/notifications"
              aria-label="Notification settings"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur"
            >
              <IconBell size={22} />
              <span className="absolute right-[10px] top-[10px] h-[9px] w-[9px] rounded-full border-2 border-[#16603a] bg-gold" />
            </Link>
          </header>
        </PatternArt>

        <div className="relative z-[1] -mt-11 flex flex-col gap-5 px-4">
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
          className="order-first flex items-center gap-3.5 rounded-3xl bg-background px-4 py-3.5 shadow-lift ring-1 ring-black/5"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-gold-soft text-gold-foreground">
            <IconClock size={22} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="font-display text-[19px] font-semibold leading-tight">
              Dhuhr 13:15
              <span className="font-sans text-[13px] font-medium text-accent"> · in 1 h 42 m</span>
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
            <span className="font-display text-[22px] font-semibold">
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
        </div>
      </main>
      <TabBar active="home" />
    </div>
  );
}
