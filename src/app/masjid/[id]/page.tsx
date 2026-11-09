"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@heroui/react";
import { HeroBack } from "@/components/app/hero-back";
import { useUserState } from "@/hooks/use-user-state";
import { formatDistance, formatTravel, getMasjid } from "@/services/masjids";
import { listEvents } from "@/services/events";
import {
  IconBookmark,
  IconCheck,
  IconChevronRight,
  IconDirections,
} from "@/components/icons";

const PRAYER_LABELS = ["Fajr", "Dhuhr", "Asr", "Mag", "Isha"] as const;

export default function MasjidDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, update] = useUserState();

  const masjid = getMasjid(params.id);
  if (!masjid) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-muted">
          We couldn’t find that masjid.
        </p>
        <button
          type="button"
          onClick={() => router.push("/explore")}
          className="min-h-[44px] text-accent underline"
        >
          Back to Explore
        </button>
      </main>
    );
  }

  const followed = state.followedMasjidIds.includes(masjid.id);
  const edits =
    masjid.id === (state.followedMasjidIds[0] ?? "masjidul-quds")
      ? state.jamaatEdits
      : {};
  const todayCells = masjid.todayJamaat
    ? [
        edits.fajr ?? masjid.todayJamaat.fajr,
        edits.dhuhr ?? masjid.todayJamaat.dhuhr,
        edits.asr ?? masjid.todayJamaat.asr,
        edits.maghrib ?? masjid.todayJamaat.maghrib,
        edits.isha ?? masjid.todayJamaat.isha,
      ]
    : null;
  const events = listEvents(state.customEvents).filter((e) => e.masjidId === masjid.id);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero — GAPS: real photo arrives via admin upload; until then a
          --default block with the masjid's initial, never a stock photo. */}
      <div className="relative flex h-[250px] flex-none items-center justify-center bg-default">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-default text-[28px] font-semibold text-muted">
            {masjid.name[0]}
          </AvatarFallback>
        </Avatar>
        <HeroBack />
      </div>

      <main className="relative z-[1] -mt-6 flex flex-1 flex-col gap-4 px-4 pb-8">
        <section className="flex flex-col gap-3.5 rounded-2xl border border-border bg-background p-4 shadow-[var(--surface-shadow)]">
          <div className="flex flex-col gap-1">
            <h1 className="text-[21px] font-bold leading-tight tracking-[-0.015em]">
              {masjid.name}
            </h1>
            <p className="text-[13px] text-muted">
              {masjid.area} · {formatDistance(masjid.distanceKm)} ·{" "}
              {formatTravel(masjid)}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-pressed={followed}
              onClick={() => {
                // Mock persistence — the backend replaces this with a real
                // follow write when Supabase arrives.
                update({
                  followedMasjidIds: followed
                    ? state.followedMasjidIds.filter((id) => id !== masjid.id)
                    : [...state.followedMasjidIds, masjid.id],
                });
              }}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[15px] font-medium ${
                followed
                  ? "border border-accent bg-accent-soft text-accent-soft-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {followed ? <IconCheck size={19} /> : <IconBookmark size={19} />}
              {followed ? "Following" : "Follow"}
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                masjid.address ?? `${masjid.name}, ${masjid.area}, Cape Town`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border text-[15px] font-medium"
            >
              <IconDirections size={19} />
              Directions
            </a>
          </div>
        </section>

        <section aria-label="Coming up here" className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[17px] font-semibold">Coming up here</h2>
            <Link
              href="/events"
              className="text-[13.5px] font-medium text-accent"
            >
              All {Math.max(events.length, 4)}
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {events.length > 0 ? (
              events.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => router.push(`/events/${event.id}`)}
                  className={`flex w-full items-center gap-3.5 px-4 py-3.5 text-start ${
                    index > 0 ? "ml-0 border-t border-separator" : ""
                  }`}
                >
                  <span className="flex w-[46px] flex-none flex-col items-center">
                    <span className="text-xs font-medium text-muted">
                      {new Date(`${event.date}T00:00:00`)
                        .toLocaleDateString("en-ZA", { weekday: "short" })
                        .toUpperCase()}
                    </span>
                    <span className="text-[22px] font-semibold leading-tight">
                      {new Date(`${event.date}T00:00:00`).getDate()}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15.5px] font-medium">
                      {event.title}
                    </span>
                    <span className="text-[13px] text-muted">
                      {event.whenNote ?? event.time}
                    </span>
                  </span>
                  <span className="flex-none text-muted">
                    <IconChevronRight size={20} />
                  </span>
                </button>
              ))
            ) : (
              <p className="px-4 py-5 text-[13px] text-muted">
                Nothing on the calendar right now.
              </p>
            )}
          </div>
        </section>

        {todayCells && (
          <section aria-label="Today’s jamaat" className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold">Today’s jamaat</h2>
              <Link
                href={`/masjid/${masjid.id}/jamaat`}
                className="text-[13.5px] font-medium text-accent"
              >
                Full week
              </Link>
            </div>
            <div className="flex overflow-hidden rounded-2xl border border-border bg-surface">
              {todayCells.map((time, index) => {
                const isNext = index === 1; // Dhuhr, per the mock "now"
                return (
                  <div key={index} className="flex flex-1 items-stretch">
                    {index > 0 && <div className="w-px bg-separator" />}
                    <div
                      className={`flex flex-1 flex-col items-center gap-[3px] px-0.5 py-[11px] ${
                        isNext ? "bg-accent-soft" : ""
                      }`}
                    >
                      <span
                        className={`text-xs ${
                          isNext
                            ? "font-semibold text-accent-soft-foreground"
                            : "text-muted"
                        }`}
                      >
                        {PRAYER_LABELS[index]}
                      </span>
                      <span
                        className={`text-[14.5px] tabular-nums ${
                          isNext
                            ? "font-bold text-accent-soft-foreground"
                            : "font-medium"
                        }`}
                      >
                        {time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {masjid.timeChange && (
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <span className="rounded-lg bg-warning-soft px-[7px] py-[3px] text-xs font-semibold text-warning-soft-foreground">
                  {masjid.timeChange.prayer}{" "}
                  {masjid.timeChange.deltaMinutes > 0 ? "+" : "−"}
                  {Math.abs(masjid.timeChange.deltaMinutes)}
                </span>
                <span>{masjid.timeChange.note}</span>
              </div>
            )}
          </section>
        )}

        <section aria-label="Getting there" className="flex flex-col gap-2.5">
          <h2 className="text-[17px] font-semibold">Getting there</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex gap-3 px-4 py-3">
              <span className="w-[70px] flex-none text-[15px] text-muted">
                Address
              </span>
              <span className="flex-1 text-[15px]">
                {masjid.address ??
                  `${masjid.name}, ${masjid.area}, Cape Town`}
              </span>
            </div>
            {masjid.phone && (
              <>
                <div className="ml-4 h-px bg-separator" />
                <div className="flex gap-3 px-4 py-3">
                  <span className="w-[70px] flex-none text-[15px] text-muted">
                    Phone
                  </span>
                  <a
                    href={`tel:${masjid.phone.replace(/\s/g, "")}`}
                    className="flex-1 text-[15px] text-link"
                  >
                    {masjid.phone}
                  </a>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
