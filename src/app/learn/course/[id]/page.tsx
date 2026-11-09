"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LinkButton } from "@/components/link-button";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { useUserState } from "@/hooks/use-user-state";
import { courseProgress, getCourse, nextLesson } from "@/services/learning";
import { IconCheck, IconChevronRight, IconPlay } from "@/components/icons";

const KIND_LABEL = { video: "Video", reading: "Reading", quiz: "Quiz" } as const;

export default function CoursePage() {
  const params = useParams<{ id: string }>();
  const [state] = useUserState();
  const course = getCourse(params.id);

  if (!course) {
    return (
      <OnboardingScreen back backHref="/learn">
        <p className="px-6 pt-4 text-muted">We couldn’t find that course.</p>
      </OnboardingScreen>
    );
  }

  const progress = courseProgress(course, state.completedLessons);
  const next = nextLesson(course, state.completedLessons);
  const label =
    progress.done === 0
      ? "Start course"
      : progress.done === progress.total
        ? "Review course"
        : "Continue";

  return (
    <OnboardingScreen
      back
      backHref="/learn"
      footer={
        <LinkButton
          href={`/learn/course/${course.id}/${next.id}`}
          variant="primary"
          size="lg"
          fullWidth
        >
          {label}
        </LinkButton>
      }
    >
      <div className="flex flex-1 flex-col gap-5 px-4 pb-4">
        <PatternArt
          tone={toneFor(course.id)}
          className="flex flex-col justify-end gap-2 rounded-3xl p-5 pt-16 text-white shadow-lift"
        >
          <span className="relative text-[12px] font-semibold uppercase tracking-wide text-white/75">
            {course.category} · {course.level}
          </span>
          <h1 className="relative text-[28px] font-bold leading-tight">
            {course.title}
          </h1>
          <span className="relative text-[13.5px] text-white/85">
            {course.teacher}
          </span>
        </PatternArt>

        <p className="text-[15.5px] leading-relaxed text-foreground/90">
          {course.summary}
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            [String(progress.total), "lessons"],
            [`${course.lessons.reduce((s, l) => s + l.minutes, 0)}`, "minutes"],
            [`${progress.percent}%`, "complete"],
          ].map(([value, unit]) => (
            <div
              key={unit}
              className="flex flex-col items-center gap-px rounded-2xl bg-surface py-3 ring-1 ring-black/5"
            >
              <span className="font-display text-[22px] font-semibold">{value}</span>
              <span className="text-[12px] text-muted">{unit}</span>
            </div>
          ))}
        </div>

        <section className="flex flex-col gap-2" aria-label="Lessons">
          <h2 className="font-display text-[22px] font-semibold">Lessons</h2>
          <div className="overflow-hidden rounded-3xl bg-background shadow-premium ring-1 ring-black/5">
            {course.lessons.map((lesson, index) => {
              const done = state.completedLessons.includes(lesson.id);
              return (
                <div key={lesson.id}>
                  {index > 0 && <div className="ml-16 h-px bg-separator" />}
                  <Link
                    href={`/learn/course/${course.id}/${lesson.id}`}
                    className="flex min-h-[64px] items-center gap-3.5 px-4 py-3 active:bg-default"
                  >
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-[13px] font-semibold ${
                        done
                          ? "bg-accent text-accent-foreground"
                          : "bg-default text-muted"
                      }`}
                    >
                      {done ? <IconCheck size={17} /> : index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="text-[15.5px] font-medium">{lesson.title}</span>
                      <span className="flex items-center gap-1.5 text-[12.5px] text-muted">
                        {lesson.kind === "video" && <IconPlay size={13} />}
                        {KIND_LABEL[lesson.kind]} · {lesson.minutes} min
                      </span>
                    </span>
                    <IconChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </OnboardingScreen>
  );
}
