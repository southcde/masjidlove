"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HeroBack } from "@/components/app/hero-back";
import { ShareButton } from "@/components/app/share-button";
import { haptic } from "@/services/native";
import { masjidHref } from "@/services/routes";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { useUserState } from "@/hooks/use-user-state";
import { formatDistance, formatTravel, getMasjid } from "@/services/masjids";
import { listEvents } from "@/services/events";
import {
  IconBookmark,
  IconCheck,
  IconChevronRight,
  IconDirections,
} from "@/components/icons";
import { eventHref, salaahHref } from "@/services/routes";

const PRAYER_LABELS = ["Fajr", "Dhuhr", "Asr", "Mag", "Isha"] as const;

function MasjidScreen() {
  const routeId = useSearchParams().get("id") ?? "";
  const router = useRouter();
  const [state, update] = useUserState();

  const masjid = getMasjid(routeId);
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
  const profile = state.masjidProfile[masjid.id] ?? {};
  const address = profile.address ?? masjid.address;
  const phone = profile.phone ?? masjid.phone;
  const notices = state.announcements
    .filter((a) => a.masjidId === masjid.id)
    .slice()
    .reverse()
    .slice(0, 2);
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
  const events = listEvents(state.customEvents, state.eventEdits).filter((e) => e.masjidId === masjid.id);

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero — GAPS: real photo arrives via admin upload; until then a
          --default block with the masjid's initial, never a stock photo. */}
      <PatternArt
        tone={toneFor(masjid.id)}
        scene="masjid"
        className="flex h-[250px] flex-none items-center justify-center"
      >
        <HeroBack />
        <ShareButton
          title={masjid.name}
          text={`${masjid.name}, ${masjid.area}`}
          path={masjidHref(masjid.id)}
          className="absolute right-3 top-3.5"
        />
      </PatternArt>

      <main className="relative z-[1] -mt-6 flex flex-1 flex-col gap-4 px-4 pb-8">
        <section className="flex flex-col gap-3.5 rounded-3xl border border-foreground/10 shadow-premium bg-background p-4 shadow-[var(--surface-shadow)]">
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
                void haptic("tap");
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
                address ?? `${masjid.name}, ${masjid.area}, Cape Town`
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

        {profile.about && (
          <p className="px-1 text-[15px] leading-relaxed text-foreground/90">
            {profile.about}
          </p>
        )}

        {notices.map((notice) => (
          <section
            key={notice.id}
            aria-label="Notice"
            className="flex flex-col gap-1 rounded-3xl bg-gold-soft p-4 text-gold-foreground"
          >
            <span className="text-[11.5px] font-semibold uppercase tracking-wide">Notice</span>
            <span className="font-display text-[17px] font-semibold leading-snug">
              {notice.title}
            </span>
            <span className="text-[14px] leading-snug">{notice.body}</span>
          </section>
        ))}

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
          <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
            {events.length > 0 ? (
              events.map((event, index) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => router.push(eventHref(event.id))}
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
          <section aria-label="Today’s salaah" className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold">Today’s salaah</h2>
              <Link
                href={salaahHref(masjid.id)}
                className="text-[13.5px] font-medium text-accent"
              >
                Full week
              </Link>
            </div>
            <div className="flex overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
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
            {profile.jumuahNote && (
              <p className="text-[12.5px] text-muted">{profile.jumuahNote}</p>
            )}
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
          <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
            <div className="flex gap-3 px-4 py-3">
              <span className="w-[70px] flex-none text-[15px] text-muted">
                Address
              </span>
              <span className="flex-1 text-[15px]">
                {address ??
                  `${masjid.name}, ${masjid.area}, Cape Town`}
              </span>
            </div>
            {phone && (
              <>
                <div className="ml-4 h-px bg-separator" />
                <div className="flex gap-3 px-4 py-3">
                  <span className="w-[70px] flex-none text-[15px] text-muted">
                    Phone
                  </span>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="flex-1 text-[15px] text-link"
                  >
                    {phone}
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

export default function MasjidDetailPage() {
  return (
    <Suspense fallback={null}>
      <MasjidScreen />
    </Suspense>
  );
}
