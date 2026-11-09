"use client";

import Link from "next/link";
import { haptic } from "@/services/native";
import {
  IconBook,
  IconCalendar,
  IconHeart,
  IconHome,
  IconMapPin,
  IconUser,
} from "@/components/icons";

const TABS = [
  { href: "/home", label: "Home", Icon: IconHome },
  { href: "/explore", label: "Explore", Icon: IconMapPin },
  { href: "/events", label: "Events", Icon: IconCalendar },
  { href: "/learn", label: "Learn", Icon: IconBook },
  { href: "/support", label: "Support", Icon: IconHeart },
  { href: "/profile", label: "Profile", Icon: IconUser },
] as const;

/**
 * Bottom tab bar. GAPS: the router owns nav chrome — the library has no
 * tab bar. Frosted bar, icon + label, active tab gets a soft accent pill.
 */
export function TabBar({ active }: { active: "home" | "explore" | "events" | "learn" | "support" | "profile" }) {
  return (
    <div className="sticky bottom-0 z-10 flex-none px-2.5 pb-2.5 pt-1">
      <nav
        aria-label="Main"
        className="flex rounded-[26px] bg-background/80 p-1 shadow-lift ring-1 ring-foreground/10 backdrop-blur-2xl"
      >
        {TABS.map(({ href, label, Icon }) => {
          const isActive = href === `/${active}`;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => void haptic("tap")}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-[56px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[22px] transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted active:bg-default"
              }`}
            >
              <Icon size={21} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
