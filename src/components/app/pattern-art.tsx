"use client";

import { useId, type ReactNode } from "react";
import { Scene, type SceneName } from "@/components/app/scene";

const TONES = ["emerald", "teal", "gold"] as const;
export type ArtTone = (typeof TONES)[number];

/** Stable tone for an id, so a card keeps its colour between renders. */
export function toneFor(id: string): ArtTone {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return TONES[sum % TONES.length];
}

/**
 * Brand art for hero areas until real photos exist: a deep gradient with a
 * tiled eight-point star. Decorative only — hidden from assistive tech.
 */
export function PatternArt({
  tone = "emerald",
  scene,
  className = "",
  children,
}: {
  tone?: ArtTone;
  /** Optional illustrated placeholder drawn bottom-right */
  scene?: SceneName;
  className?: string;
  children?: ReactNode;
}) {
  const id = useId();
  return (
    <div className={`relative overflow-hidden bg-art-${tone} ${className}`}>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={id}
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M22 3 26.6 13.4 37.5 9.6 33.4 20.6 41 22 33.4 23.4 37.5 34.4 26.6 30.6 22 41 17.4 30.6 6.5 34.4 10.6 23.4 3 22 10.6 20.6 6.5 9.6 17.4 13.4Z"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect className="pattern-drift" width="200%" height="200%" fill={`url(#${id})`} />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(255,255,255,0.16),transparent_60%)]" />
      {scene && <Scene name={scene} />}
      {children}
    </div>
  );
}
