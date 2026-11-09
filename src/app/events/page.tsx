"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { TabBar } from "@/components/app/tab-bar";
import { useUserState } from "@/hooks/use-user-state";
import { listEvents } from "@/services/events";
import { getMasjid } from "@/services/masjids";
import type { Event, Rsvp } from "@/types";
import {
  IconCheck,
  IconQuestion,
  IconX,
} from "@/components/icons";
import { eventHref } from "@/services/routes";

const FILTERS = ["Upcoming", "Going", "Past"] as const;

function RSVPBadge({ rsvp }: { rsvp?: Rsvp }) {
  if (rsvp === "going") {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-accent-soft px-2 py-1 text-[12.5px] font-semibold text-accent-soft-foreground">
        <IconCheck size={14} />
        Going
      </span>
    );
  }
  if (rsvp === "maybe") {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-warning-soft px-2 py-1 text-[12.5px] font-semibold text-warning-soft-foreground">
        <IconQuestion size={14} />
        Maybe
      </span>
    );
  }
  if (rsvp === "cant-go") {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-default px-2 py-1 text-[12.5px] font-medium text-muted">
        <IconX size={14} />
        Can’t go
      </span>
    );
  }
  return (
    <span className="rounded-lg border border-accent px-2.5 py-1 text-[12.5px] font-semibold text-accent">
      RSVP
    </span>
  );
}

function EventRow({ event, myRsvp }: { event: Event; myRsvp?: Rsvp }) {
  const router = useRouter();
  const masjid = getMasjid(event.masjidId);
  const date = new Date(`${event.date}T00:00:00`);
  const going = myRsvp === "going";

  return (
    <button
      type="button"
      onClick={() => router.push(eventHref(event.id))}
      className="flex w-full items-center gap-3.5 rounded-3xl border border-foreground/10 bg-background p-3.5 text-start shadow-premium active:bg-default"
    >
      <span
        className={`flex h-[68px] w-[60px] flex-none flex-col items-center justify-center rounded-2xl ${
          going ? "bg-accent text-accent-foreground" : "bg-default"
        }`}
      >
        <span
          className={`text-[11.5px] font-semibold ${
            going ? "text-accent-foreground/80" : "text-muted"
          }`}
        >
          {date
            .toLocaleDateString("en-ZA", { weekday: "short" })
            .toUpperCase()}
        </span>
        <span
          className="font-display text-[30px] font-semibold leading-none"
        >
          {date.getDate()}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <span className="text-base font-semibold leading-tight">
          {event.title}
        </span>
        <span className="text-[13px] text-muted">
          {event.time} · {masjid?.name}
        </span>
        <span className="flex items-center gap-2">
          <RSVPBadge rsvp={myRsvp} />
          <span className="text-[12.5px] text-muted">
            {myRsvp === "maybe"
              ? `${event.goingCount} going · ${event.maybeCount} maybe`
              : `${event.goingCount} going${
                  myRsvp ? "" : " · Open to all"
                }`}
          </span>
        </span>
      </span>
    </button>
  );
}

export default function EventsPage() {
  useOnboardingGuard();
  const [state] = useUserState();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Upcoming");
  const all = listEvents(state.customEvents, state.eventEdits);
  // Mock data has no past events yet; "Past" is honestly empty.
  const events =
    filter === "Going"
      ? all.filter((e) => state.rsvps[e.id] === "going")
      : filter === "Past"
        ? []
        : all;
  const thisWeek = events.slice(0, 3);
  const nextWeek = events.slice(3);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4 pt-1">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold tracking-[-0.02em]">Events</h1>
          <span className="text-[13px] text-muted">
            {state.followedMasjidIds.length || 4} masjids
          </span>
        </div>

        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set([filter])}
          onSelectionChange={(keys) => {
            const key = Array.from(keys as Set<string>)[0];
            if (key) setFilter(key as (typeof FILTERS)[number]);
          }}
          aria-label="Event filters"
          className="flex gap-2 self-start"
        >
          {FILTERS.map((filter) => (
            <ToggleButton
              key={filter}
              id={filter}
              variant="default"
              className="min-h-[44px] rounded-xl px-3.5 text-sm font-medium data-[selected=true]:bg-accent data-[selected=true]:font-semibold data-[selected=true]:text-accent-foreground"
            >
              {filter}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {events.length === 0 && (
          <p className="px-0.5 py-6 text-[15px] text-muted">
            {filter === "Going"
              ? "You haven’t said you’re going to anything yet."
              : "Nothing here yet."}
          </p>
        )}
        {thisWeek.length > 0 && (
          <>
            <h2 className="pl-0.5 text-[13.5px] font-medium text-muted">
              This week
            </h2>
            <div className="flex flex-col gap-3">
              {thisWeek.map((event) => (
                <EventRow key={event.id} event={event} myRsvp={state.rsvps[event.id]} />
              ))}
            </div>
          </>
        )}
        {nextWeek.length > 0 && (
          <>
            <h2 className="pl-0.5 text-[13.5px] font-medium text-muted">
              Next week
            </h2>
            <div className="flex flex-col gap-3">
              {nextWeek.map((event) => (
                <EventRow key={event.id} event={event} myRsvp={state.rsvps[event.id]} />
              ))}
            </div>
          </>
        )}
      </main>
      <TabBar active="events" />
    </div>
  );
}
