"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Tabs } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useUserState } from "@/hooks/use-user-state";
import { getMasjid } from "@/services/masjids";
import {
  applyJamaatEdits,
  jamaatWeekQuds,
  jamaatWeekQudsNext,
  jumuahNote,
  prayerNames,
  type JamaatWeek,
} from "@/services/jamaat";
import { IconAlert } from "@/components/icons";

const PRAYER_KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

export default function JamaatWeekPage() {
  const params = useParams<{ id: string }>();
  const [state] = useUserState();
  const [week, setWeek] = useState<"this" | "next">("this");

  // Mock: only Masjidul Quds has week data; other ids fall back to it.
  const masjid = getMasjid(params.id) ?? getMasjid("masjidul-quds");
  if (!masjid) return null;

  const data: JamaatWeek =
    week === "this" && masjid.id === (state.followedMasjidIds[0] ?? "masjidul-quds")
      ? applyJamaatEdits(jamaatWeekQuds, state.jamaatEdits, state.jamaatEditsWholeWeek)
      : jamaatWeekQudsNext;
  const changedCount = data.days.filter((d) => d.delta).length;

  return (
    <OnboardingScreen back backHref={`/masjid/${params.id}`}>
      <div className="flex flex-1 flex-col gap-4 px-4">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[21px] font-bold tracking-[-0.015em]">
            {masjid.name}
          </h1>
          <p className="text-[13px] text-muted">{data.label}</p>
        </div>

        <Tabs
          aria-label="Week"
          selectedKey={week}
          onSelectionChange={(key) => setWeek(key as "this" | "next")}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Week">
              <Tabs.Tab id="this-week">This week</Tabs.Tab>
              <Tabs.Tab id="next-week">Next week</Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        <div
          role="status"
          className="flex items-start gap-2.5 rounded-2xl bg-warning-soft p-3.5"
        >
          <span className="mt-0.5 flex-none text-warning-soft-foreground">
            <IconAlert size={20} />
          </span>
          <span className="text-[13.5px] leading-snug text-warning-soft-foreground">
            {changedCount} times moved since last week. Each one shows how much
            it changed.
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-black/5 shadow-premium">
          <div className="flex border-b border-separator bg-surface">
            <span className="w-[54px] flex-none py-2 pl-3" />
            {prayerNames.map((name) => (
              <span
                key={name}
                className="flex-1 py-2 text-center text-xs font-medium text-muted"
              >
                {name}
              </span>
            ))}
          </div>
          {data.days.map((day) => {
            const isToday = week === "this" && day.day === "Wed 2";
            return (
              <div
                key={day.day}
                className={`flex items-stretch border-b border-separator last:border-b-0 ${
                  isToday ? "bg-accent-soft" : ""
                }`}
              >
                <span
                  className={`flex w-[54px] flex-none items-center pl-3 text-[13px] ${
                    isToday
                      ? "font-bold text-accent-soft-foreground"
                      : "text-muted"
                  }`}
                >
                  {day.day}
                </span>
                {PRAYER_KEYS.map((key, prayerIndex) => {
                  const time = day[key];
                  const delta =
                    day.delta && day.delta.prayer === prayerIndex
                      ? day.delta.minutes
                      : null;
                  return (
                    <span
                      key={key}
                      className="flex flex-1 flex-col items-center justify-center gap-0.5 py-[7px]"
                    >
                      <span
                        className={`text-[14.5px] tabular-nums ${
                          delta !== null
                            ? "font-bold"
                            : isToday
                              ? "font-semibold text-accent-soft-foreground"
                              : ""
                        }`}
                      >
                        {time}
                      </span>
                      {delta !== null && (
                        <span className="rounded-md bg-warning-soft px-[5px] py-px text-[11px] font-semibold text-warning-soft-foreground">
                          {delta > 0 ? "+" : "−"}
                          {Math.abs(delta)}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-2 text-[13px] leading-normal text-muted">
          <span className="mt-0.5 flex-none rounded-md bg-warning-soft px-[5px] py-px text-[11px] font-semibold text-warning-soft-foreground">
            ±min
          </span>
          <span>
            Minutes different from the same day last week. Tap a time to see
            its history.
          </span>
        </div>
        <p className="text-[13px] text-muted">{jumuahNote}</p>
      </div>
    </OnboardingScreen>
  );
}

