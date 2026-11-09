"use client";

import Link from "next/link";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { TabBar } from "@/components/app/tab-bar";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { useUserState } from "@/hooks/use-user-state";
import {
  courseProgress,
  listClasses,
  classWhen,
  listCourses,
  nextLesson,
  seatsLeft,
} from "@/services/learning";
import { getMasjid } from "@/services/masjids";
import { IconChevronRight, IconClock, IconPlay } from "@/components/icons";

const MODES = ["Courses", "In person"] as const;

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 overflow-hidden rounded-full bg-default"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-[#2b8d5c]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function LearnPage() {
  useOnboardingGuard();
  const [state] = useUserState();
  const [mode, setMode] = useState<(typeof MODES)[number]>("Courses");

  const courses = listCourses();
  const classes = listClasses();
  const started = courses
    .map((course) => ({ course, progress: courseProgress(course, state.completedLessons) }))
    .filter(({ progress }) => progress.done > 0 && progress.done < progress.total);
  const featured = started[0];
  const myClasses = classes.filter((c) => state.bookings[c.id]);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 pt-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-bold leading-tight">Learn</h1>
          <p className="text-[14px] text-muted">
            Study at your own pace, or sit with a teacher in person.
          </p>
        </div>

        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set([mode])}
          onSelectionChange={(keys) => {
            const key = Array.from(keys as Set<string>)[0];
            if (key) setMode(key as (typeof MODES)[number]);
          }}
          aria-label="Learning mode"
          className="grid grid-cols-2 gap-1 rounded-2xl bg-default p-1"
        >
          {MODES.map((m) => (
            <ToggleButton
              key={m}
              id={m}
              variant="default"
              className="min-h-[44px] rounded-xl bg-transparent text-[14px] font-medium shadow-none data-[selected=true]:bg-background data-[selected=true]:font-semibold data-[selected=true]:shadow-premium"
            >
              {m}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {mode === "Courses" ? (
          <>
            {featured && (
              <Link
                href={`/learn/course/${featured.course.id}/${nextLesson(featured.course, state.completedLessons).id}`}
                className="block overflow-hidden rounded-3xl shadow-lift"
              >
                <PatternArt tone="emerald" className="flex flex-col gap-3 p-5 text-white">
                  <span className="relative text-[12.5px] font-medium text-white/75">
                    Continue learning
                  </span>
                  <span className="font-display relative text-[22px] font-semibold leading-tight">
                    {featured.course.title}
                  </span>
                  <span className="relative text-[13px] text-white/80">
                    {nextLesson(featured.course, state.completedLessons).title}
                  </span>
                  <div className="relative flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${featured.progress.percent}%` }}
                      />
                    </div>
                    <span className="text-[12.5px] font-semibold">
                      {featured.progress.percent}%
                    </span>
                  </div>
                </PatternArt>
              </Link>
            )}

            <section className="flex flex-col gap-3" aria-label="All courses">
              <h2 className="font-display text-[22px] font-semibold">
                All courses
              </h2>
              {courses.map((course) => {
                const progress = courseProgress(course, state.completedLessons);
                return (
                  <Link
                    key={course.id}
                    href={`/learn/course/${course.id}`}
                    className="flex gap-3.5 rounded-3xl bg-background p-3 shadow-premium ring-1 ring-foreground/10 transition-transform active:scale-[0.99]"
                  >
                    <PatternArt
                      tone={toneFor(course.id)}
                      className="flex h-[88px] w-[88px] flex-none items-center justify-center rounded-2xl text-white"
                    >
                      <span className="relative">
                        <IconPlay size={30} />
                      </span>
                    </PatternArt>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                      <span className="text-[11.5px] font-semibold uppercase tracking-wide text-gold-foreground">
                        {course.category} · {course.level}
                      </span>
                      <span className="font-display text-[17px] font-semibold leading-snug">
                        {course.title}
                      </span>
                      <span className="text-[12.5px] text-muted">
                        {course.teacher} · {progress.total} lessons
                      </span>
                      {progress.done > 0 && <ProgressBar percent={progress.percent} />}
                    </div>
                  </Link>
                );
              })}
            </section>
          </>
        ) : (
          <>
            {myClasses.length > 0 && (
              <section className="flex flex-col gap-3" aria-label="Your bookings">
                <h2 className="font-display text-[22px] font-semibold">
                  Your bookings
                </h2>
                {myClasses.map((session) => (
                  <Link
                    key={session.id}
                    href={`/learn/class/${session.id}`}
                    className="flex items-center gap-3 rounded-3xl bg-accent-soft p-4 ring-1 ring-accent/20"
                  >
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <IconClock size={20} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="text-[15.5px] font-semibold text-accent-soft-foreground">
                        {session.title}
                      </span>
                      <span className="text-[13px] text-accent-soft-foreground/80">
                        {classWhen(session)} · {state.bookings[session.id]} seat
                        {state.bookings[session.id] === 1 ? "" : "s"}
                      </span>
                    </span>
                    <IconChevronRight size={16} />
                  </Link>
                ))}
              </section>
            )}

            <section className="flex flex-col gap-3" aria-label="Upcoming classes">
              <h2 className="font-display text-[22px] font-semibold">
                Upcoming classes
              </h2>
              {classes.map((session) => {
                const mine = state.bookings[session.id] ?? 0;
                const left = seatsLeft(session, mine);
                const masjid = getMasjid(session.masjidId);
                return (
                  <Link
                    key={session.id}
                    href={`/learn/class/${session.id}`}
                    className="overflow-hidden rounded-3xl bg-background shadow-premium ring-1 ring-foreground/10 transition-transform active:scale-[0.99]"
                  >
                    <PatternArt tone={toneFor(session.id)} className="h-[84px]">
                      <span className="absolute left-3.5 top-3 rounded-full bg-black/35 px-3 py-1.5 text-[12.5px] font-semibold text-white backdrop-blur">
                        {classWhen(session)}
                      </span>
                      <span className="absolute right-3.5 top-3 rounded-full bg-black/25 px-2.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur">
                        {session.price}
                      </span>
                    </PatternArt>
                    <div className="flex flex-col gap-1.5 p-4">
                      <span className="font-display text-[18px] font-semibold leading-snug">
                        {session.title}
                      </span>
                      <span className="text-[13px] text-muted">
                        {session.teacher} · {masjid?.name}
                      </span>
                      <span
                        className={`self-start rounded-full px-2.5 py-1 text-[12.5px] font-semibold ${
                          mine
                            ? "bg-accent-soft text-accent-soft-foreground"
                            : left === 0
                              ? "bg-default text-muted"
                              : left <= 5
                                ? "bg-gold-soft text-gold-foreground"
                                : "bg-default text-default-foreground"
                        }`}
                      >
                        {mine
                          ? `Booked · ${mine} seat${mine === 1 ? "" : "s"}`
                          : left === 0
                            ? "Full · join waitlist"
                            : `${left} seat${left === 1 ? "" : "s"} left`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </section>
          </>
        )}
      </main>
      <TabBar active="learn" />
    </div>
  );
}
