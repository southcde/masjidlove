"use client";

/**
 * Illustrated placeholders for image slots until real photography exists.
 * Drawn as line-and-fill SVG in currentColor so they sit quietly on the
 * gradient art behind them. No stock photos, no external files.
 */
export type SceneName = "masjid" | "book" | "circle" | "hands" | "bowl" | "drop";

const SCENES: Record<SceneName, React.ReactNode> = {
  masjid: (
    <>
      {/* main dome, finial and crescent */}
      <path d="M72 84a28 28 0 0 1 56 0Z" fill="currentColor" />
      <path d="M100 56V40" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="36" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* side domes */}
      <path d="M44 84a14 14 0 0 1 28 0Z" fill="currentColor" opacity=".7" />
      <path d="M128 84a14 14 0 0 1 28 0Z" fill="currentColor" opacity=".7" />
      {/* minarets */}
      <path d="M22 110V52l8-22 8 22v58Z" fill="currentColor" />
      <path d="M162 110V52l8-22 8 22v58Z" fill="currentColor" />
      <path d="M30 30V20M170 30V20" stroke="currentColor" strokeWidth="2" />
      {/* body */}
      <path d="M38 84h124v26H38Z" fill="currentColor" opacity=".85" />
      <path
        d="M92 110V98a8 8 0 0 1 16 0v12M60 110v-8a6 6 0 0 1 12 0v8M128 110v-8a6 6 0 0 1 12 0v8"
        fill="none"
        stroke="rgba(0,0,0,.35)"
        strokeWidth="2"
      />
    </>
  ),
  book: (
    <>
      <path d="M100 96C84 86 58 84 36 90V40c22-6 48-4 64 6Z" fill="currentColor" />
      <path
        d="M100 96c16-10 42-12 64-6V40c-22-6-48-4-64 6Z"
        fill="currentColor"
        opacity=".7"
      />
      <path d="M100 46v50" stroke="rgba(0,0,0,.3)" strokeWidth="2" />
      <path d="M52 104l48-14 48 14" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M100 18l3 7 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z"
        fill="currentColor"
        opacity=".8"
      />
    </>
  ),
  circle: (
    <>
      {[28, 64, 100, 136, 172].map((x, i) => {
        const y = i % 2 === 0 ? 78 : 70;
        return (
          <g key={x}>
            <circle cx={x} cy={y - 14} r="9" fill="currentColor" />
            <path d={`M${x - 16} 110a16 16 0 0 1 32 0Z`} fill="currentColor" opacity={i % 2 ? 0.7 : 1} />
          </g>
        );
      })}
      <path d="M12 110h176" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  hands: (
    <>
      <path
        d="M100 82s-28-16-28-34a15 15 0 0 1 28-8 15 15 0 0 1 28 8c0 18-28 34-28 34Z"
        fill="currentColor"
      />
      <path
        d="M36 104c14-4 28-8 40-18 8-6 16-4 22 2l-10 12c-14 8-32 10-52 8Z"
        fill="currentColor"
        opacity=".75"
      />
      <path
        d="M164 104c-14-4-28-8-40-18-8-6-16-4-22 2l10 12c14 8 32 10 52 8Z"
        fill="currentColor"
        opacity=".75"
      />
    </>
  ),
  bowl: (
    <>
      <path d="M36 70h128a64 40 0 0 1-128 0Z" fill="currentColor" />
      <path d="M70 108h60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M80 58c-6-8 6-12 0-22M104 58c-6-8 6-12 0-26M128 58c-6-8 6-12 0-22"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".8"
      />
    </>
  ),
  drop: (
    <>
      <path d="M100 18s34 36 34 62a34 34 0 0 1-68 0c0-26 34-62 34-62Z" fill="currentColor" />
      <path d="M44 66s14 16 14 26a14 14 0 0 1-28 0c0-10 14-26 14-26Z" fill="currentColor" opacity=".6" />
      <path d="M160 74s12 14 12 22a12 12 0 0 1-24 0c0-8 12-22 12-22Z" fill="currentColor" opacity=".6" />
      <path d="M10 108q20-8 40 0t40 0 40 0 40 0 20-4" fill="none" stroke="currentColor" strokeWidth="3" />
    </>
  ),
};

export function Scene({
  name,
  className = "",
}: {
  name: SceneName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 110"
      preserveAspectRatio="xMaxYMax meet"
      className={`pointer-events-none absolute inset-0 h-full w-full text-white/20 ${className}`}
    >
      {SCENES[name]}
    </svg>
  );
}

/** Pick a fitting scene from a title or kind, so data doesn't need to carry one. */
export function sceneFor(text: string): SceneName {
  const t = text.toLowerCase();
  if (/soup|kitchen|food|meal/.test(t)) return "bowl";
  if (/water|well/.test(t)) return "drop";
  if (/relief|orphan|sadaqah|zakat|give|bursar/.test(t)) return "hands";
  if (/tafs|qur|tajw|hifz|seerah|arabic|madrasah|salah|book|course/.test(t)) return "book";
  if (/class|circle|workshop|evening|clinic|support|fiqh/.test(t)) return "circle";
  return "masjid";
}
