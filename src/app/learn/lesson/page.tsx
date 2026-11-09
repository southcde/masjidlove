"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Alert, Button } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { sceneFor } from "@/components/app/scene";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { haptic } from "@/services/native";
import { useUserState } from "@/hooks/use-user-state";
import { getLesson } from "@/services/learning";
import { IconCheck, IconPlay } from "@/components/icons";
import { courseHref, lessonHref } from "@/services/routes";

function LessonScreen() {
  const search = useSearchParams();
  const routeId = search.get("course") ?? "";
  const lessonId = search.get("lesson") ?? "";
  const router = useRouter();
  const [state, update] = useUserState();
  const [picked, setPicked] = useState<number | null>(null);

  const found = getLesson(routeId, lessonId);
  if (!found) {
    return (
      <OnboardingScreen back backHref="/learn">
        <p className="px-6 pt-4 text-muted">We couldn’t find that lesson.</p>
      </OnboardingScreen>
    );
  }

  const { course, lesson, index } = found;
  const done = state.completedLessons.includes(lesson.id);
  const nextLesson = course.lessons[index + 1];
  const quizPassed = !lesson.quiz || picked === lesson.quiz.answer;
  const canComplete = done || quizPassed;

  function complete() {
    if (!done) {
      update({ completedLessons: [...state.completedLessons, lesson.id] });
    }
    router.push(
      nextLesson
        ? lessonHref(course.id, nextLesson.id)
        : courseHref(course.id)
    );
  }

  return (
    <OnboardingScreen
      back
      backHref={courseHref(course.id)}
      step={`Lesson ${index + 1} of ${course.lessons.length}`}
      footer={
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isDisabled={!canComplete}
          onPress={complete}
        >
          {done
            ? nextLesson
              ? "Next lesson"
              : "Back to course"
            : nextLesson
              ? "Mark complete and continue"
              : "Mark complete and finish"}
        </Button>
      }
    >
      <div className="flex flex-1 flex-col gap-5 px-4 pb-4">
        {lesson.kind === "video" && (
          <PatternArt
            tone={toneFor(course.id)}
            scene={sceneFor(course.title)}
            className="flex aspect-video items-center justify-center rounded-3xl text-white shadow-lift"
          >
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/40 backdrop-blur">
              <IconPlay size={34} />
            </span>
            <span className="absolute bottom-3 left-4 text-[12.5px] font-medium text-white/85">
              {lesson.minutes} min · recording coming soon
            </span>
          </PatternArt>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-gold-foreground">
            {course.title}
          </span>
          <h1 className="text-[27px] font-bold leading-tight">{lesson.title}</h1>
        </div>

        <p className="text-[16px] leading-relaxed text-foreground/90">
          {lesson.body}
        </p>

        {lesson.quiz && (
          <section className="flex flex-col gap-3" aria-label="Quiz">
            <h2 className="font-display text-[19px] font-semibold">
              {lesson.quiz.question}
            </h2>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answers">
              {lesson.quiz.options.map((option, i) => {
                const selected = picked === i;
                const correct = selected && i === lesson.quiz!.answer;
                const wrong = selected && i !== lesson.quiz!.answer;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setPicked(i);
                      void haptic(i === lesson.quiz!.answer ? "success" : "warning");
                    }}
                    className={`flex min-h-[52px] items-center justify-between rounded-2xl px-4 py-3 text-left text-[15.5px] ring-1 transition-colors ${
                      correct
                        ? "anim-pop bg-accent-soft font-semibold text-accent-soft-foreground ring-accent"
                        : wrong
                          ? "anim-shake bg-danger/10 text-danger ring-danger"
                          : "bg-background ring-foreground/15 active:bg-default"
                    }`}
                  >
                    {option}
                    {correct && <IconCheck size={18} />}
                  </button>
                );
              })}
            </div>
            {picked !== null && !quizPassed && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Not quite — have another look and try again.</Alert.Title>
                </Alert.Content>
              </Alert>
            )}
          </section>
        )}
      </div>
    </OnboardingScreen>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={null}>
      <LessonScreen />
    </Suspense>
  );
}
