"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, Chip } from "@heroui/react";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { sceneFor } from "@/components/app/scene";
import { useUserState } from "@/hooks/use-user-state";
import { getEvent } from "@/services/events";
import { getMasjid } from "@/services/masjids";
import type { Rsvp } from "@/types";
import {
  IconBack,
  IconCalendar,
  IconCheck,
  IconMapPin,
  IconQuestion,
  IconX,
} from "@/components/icons";

const RSVP_OPTIONS: { value: Rsvp; label: string; Icon: typeof IconCheck }[] = [
  { value: "going", label: "Going", Icon: IconCheck },
  { value: "maybe", label: "Maybe", Icon: IconQuestion },
  { value: "cant-go", label: "Can't go", Icon: IconX },
];

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const [state, , { setRsvp }] = useUserState();

  const event = getEvent(params.id, state.customEvents, state.eventEdits);
  if (!event) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-muted">
          We couldn’t find that event.
        </p>
        <Link href="/events" className="min-h-[44px] text-accent underline">
          Back to Events
        </Link>
      </main>
    );
  }

  const masjid = getMasjid(event.masjidId);
  const myRsvp = state.rsvps[event.id] ?? null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero is optional per event — no photo exists yet, so the screen
          starts at the kicker and the layout holds either way. */}
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pt-4">
        <header className="flex h-11 items-center">
          <Link
            href="/events"
            aria-label="Back"
            className="-ml-2.5 flex h-11 w-11 items-center justify-center rounded-xl text-foreground active:bg-default"
          >
            <IconBack size={24} />
          </Link>
        </header>

        <PatternArt
          tone={toneFor(event.id)}
          scene={sceneFor(event.title)}
          className="h-[150px] rounded-3xl shadow-premium"
        />

        {event.cancelled && (
          <div role="status" className="rounded-2xl bg-danger/10 p-4 text-[14.5px] font-medium text-danger">
            This event has been cancelled by the masjid.
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {event.kind && (
            <Chip
              variant="secondary"
              className="self-start bg-accent-soft text-[12.5px] font-semibold text-accent-soft-foreground"
            >
              {event.kind}
            </Chip>
          )}
          <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em]">
            {event.title}
          </h1>
        </div>

        <section className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex-none text-muted">
              <IconCalendar size={20} />
            </span>
            <div>
              <div className="text-[15.5px] font-medium">
                {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                  "en-ZA",
                  { weekday: "long", day: "numeric", month: "short" }
                )}
                , {event.time}
              </div>
              <div className="text-[13px] text-muted">{event.whenNote}</div>
            </div>
          </div>
          <div className="ml-4 h-px bg-separator" />
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex-none text-muted">
              <IconMapPin size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15.5px] font-medium">
                {masjid?.name}
                {event.whereNote ? ` — main hall` : ""}
              </div>
              <div className="text-[13px] text-muted">{event.whereNote}</div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                event.whereNote ?? masjid?.address ?? masjid?.name ?? ""
              )}`}
              className="text-[13px] font-semibold text-accent"
            >
              Directions
            </a>
          </div>
        </section>

        <p className="text-[15.5px] leading-relaxed">{event.description}</p>

        <div className="flex items-center gap-3.5 pb-4">
          <div className="flex">
            {["YA", "RM", "FS"].slice(0, event.goingCount).map((initials, index) => (
              <Avatar
                key={initials}
                className={`h-[38px] w-[38px] ${index > 0 ? "-ml-[11px]" : ""}`}
              >
                <AvatarFallback className="border-[2.5px] border-background bg-default text-[13px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {event.goingCount > 3 && (
            <Avatar className="-ml-[11px] h-[38px] w-[38px]">
              <AvatarFallback className="border-[2.5px] border-background bg-accent-soft text-[12.5px] font-bold text-accent-soft-foreground">
                +{event.goingCount - 3}
              </AvatarFallback>
            </Avatar>
            )}
          </div>
          <span className="text-[14.5px] text-muted">
            {event.goingCount} going, {event.maybeCount} maybe
          </span>
        </div>
      </main>

      <footer className="flex flex-col gap-2 border-t border-separator bg-background px-4 pb-8 pt-3.5">
        <div className="flex gap-2">
          {RSVP_OPTIONS.map(({ value, label, Icon }) => {
            const selected = myRsvp === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setRsvp(event.id, selected ? null : value)}
                className={`flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl ${
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-foreground"
                }`}
              >
                <Icon size={20} />
                <span
                  className={`text-[12.5px] ${selected ? "font-semibold" : ""}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-center text-[12.5px] text-muted">
          {myRsvp === "going"
            ? "You’re going — the masjid can see your name."
            : myRsvp === "maybe"
              ? "Marked as maybe. You can change this any time."
              : myRsvp === "cant-go"
                ? "Marked as can't go."
                : "Answer and the masjid knows who's coming."}
        </p>
      </footer>
    </div>
  );
}
