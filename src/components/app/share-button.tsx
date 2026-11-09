"use client";

import { useState } from "react";
import { IconShare } from "@/components/icons";
import { haptic, shareScreen } from "@/services/native";

/**
 * Share the current screen. Uses the native share sheet in the app, the Web
 * Share API where it exists, and copies the link otherwise.
 */
export function ShareButton({
  title,
  text,
  path,
  className = "",
}: {
  title: string;
  text: string;
  path: string;
  className?: string;
}) {
  const [note, setNote] = useState<string | null>(null);

  async function share() {
    void haptic("tap");
    const result = await shareScreen({ title, text, path });
    if (result === "copied") setNote("Link copied");
    else if (result === "unsupported") setNote("Sharing isn’t available here");
    else return;
    setTimeout(() => setNote(null), 2200);
  }

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-label={`Share ${title}`}
        onClick={share}
        className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-black/30 text-white backdrop-blur"
      >
        <IconShare size={21} />
      </button>
      {note && (
        <span
          role="status"
          className="absolute right-0 top-12 z-20 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-[12.5px] font-medium text-background shadow-lift"
        >
          {note}
        </span>
      )}
    </span>
  );
}
