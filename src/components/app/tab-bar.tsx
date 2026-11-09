"use client";

import Link from "next/link";
import {
  IconBook,
  IconCalendar,
  IconHome,
  IconMapPin,
  IconUser,
} from "@/components/icons";

const TABS = [
  { href: "/home", label: "Home", Icon: IconHome },
  { href: "/explore", label: "Explore", Icon: IconMapPin },
  { href: "/events", label: "Events", Icon: IconCalendar },
  { href: "/learn", label: "Learn", Icon: IconBook },
  { href: "/profile", label: "Profile", Icon: IconUser },
] as const;

/**
 * Bottom tab bar. GAPS: the router owns nav chrome — the library has no
 * tab bar. Frosted bar, icon + label, active tab gets a soft accent pill.
 */
export function TabBar({ active }: { active: "home" | "explore" | "events" | "learn" | "profile" }) {
  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 z-10 flex flex-none border-t border-separator bg-background/85 pt-2 backdrop-blur-xl"
    >
      {TABS.map(({ href, label, Icon }) => {
        const isActive = href === `/${active}`;
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-[62px] flex-1 flex-col items-center justify-center gap-0.5 ${
              isActive ? "font-semibold text-accent" : "text-muted"
            }`}
          >
            <span
              className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                isActive ? "bg-accent-soft" : ""
              }`}
            >
              <Icon size={23} />
            </span>
            <span className="text-[11px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
