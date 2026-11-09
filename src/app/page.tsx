"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserState } from "@/hooks/use-user-state";
import { Typography } from "@heroui/react";
import { LinkButton } from "@/components/link-button";

/**
 * Brand background — gradient and three wave bands, brand art from the
 * spec (GAPS: ship the real SVG from the design file; wave colours are
 * sampled from the icon: #4aa877, #2f8f5b).
 */
function BrandBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-[50px] h-[560px]"
    >
      <svg
        viewBox="0 0 393 560"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <defs>
          <linearGradient id="welcome-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.15" stopColor="#dcefe3" />
            <stop offset="0.42" stopColor="#6fb890" />
            <stop offset="0.70" stopColor="#2b8d5c" />
            <stop offset="1" stopColor="#2b8d5c" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="393" height="560" fill="url(#welcome-gradient)" />
        <path
          d="M0 330 C 96 288 156 362 246 394 C 314 418 358 410 393 390 L393 560 L0 560 Z"
          fill="#4aa877"
        />
        <path
          d="M0 368 C 96 326 156 400 246 432 C 314 456 358 448 393 428 L393 560 L0 560 Z"
          fill="#2f8f5b"
        />
        <path
          d="M0 414 C 96 372 156 446 246 478 C 314 502 358 494 393 474 L393 560 L0 560 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}

export default function WelcomePage() {
  const router = useRouter();
  const [state, , { hydrated }] = useUserState();
  useEffect(() => {
    if (hydrated && state.onboardingComplete) router.replace("/home");
  }, [hydrated, state.onboardingComplete, router]);

  return (
    <div className="relative flex flex-1 flex-col">
      <BrandBackdrop />
      <div className="relative flex flex-1 items-center justify-center pb-[120px]">
        <Image
          src="/app-icon.png"
          alt="MasjidLove"
          width={136}
          height={136}
          priority
          className="block h-[136px] w-[136px] rounded-[34px] shadow-[0_10px_28px_rgba(11,74,43,0.28)]"
        />
      </div>
      <div className="relative flex flex-col items-center gap-3.5 px-7 pb-6">
        <Typography.Heading level={1} className="text-center leading-[1.12]">
          As-salaamu
          <br />
          Alaykum
        </Typography.Heading>
        <Typography.Paragraph className="max-w-[310px] text-center text-muted">
          Welcome to MasjidLove. Take part, connect, and grow with the masjids
          around you.
        </Typography.Paragraph>
      </div>
      <footer className="relative px-6 pb-8">
        <LinkButton
          href="/continue-with"
          variant="primary"
          size="lg"
          fullWidth
          className="h-14"
        >
          Continue to MasjidLove
        </LinkButton>
      </footer>
    </div>
  );
}
