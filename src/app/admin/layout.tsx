"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LinkButton } from "@/components/link-button";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { useAdmin } from "@/hooks/use-admin";
import {
  IconAdmin,
  IconBell,
  IconBook,
  IconCalendar,
  IconClock,
  IconHeart,
  IconHome,
} from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Overview", Icon: IconHome, exact: true },
  { href: "/admin/events", label: "Events", Icon: IconCalendar },
  { href: "/admin/classes", label: "Classes", Icon: IconBook },
  { href: "/admin/times", label: "Salaah times", Icon: IconClock },
  { href: "/admin/giving", label: "Giving", Icon: IconHeart },
  { href: "/admin/announcements", label: "Announcements", Icon: IconBell },
  { href: "/admin/masjid", label: "Masjid profile", Icon: IconAdmin },
] as const;

/**
 * Admin dashboard shell. Deliberately a wide desktop layout (sidebar +
 * content) that breaks out of the 390px phone column — an owner decision for
 * the admin side only. On a phone the sidebar becomes a scrolling tab strip.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  useOnboardingGuard();
  const pathname = usePathname();
  const { state, masjid, actions } = useAdmin();

  if (!actions.hydrated) return null;

  if (state.role !== "admin") {
    return (
      <main className="admin-shell flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-[28px] font-bold">Admins only</h1>
        <p className="max-w-sm text-muted">
          This area is for masjid admins. Choose the admin role when you set
          up your account to manage a masjid.
        </p>
        <LinkButton href="/profile" variant="primary">
          Back to Profile
        </LinkButton>
      </main>
    );
  }

  return (
    <div className="admin-shell flex min-h-dvh flex-1 flex-col md:flex-row">
      <aside className="flex flex-none flex-col gap-3 border-b border-separator bg-surface/80 p-3 backdrop-blur md:sticky md:top-0 md:h-dvh md:w-[264px] md:gap-6 md:border-b-0 md:border-r md:p-5">
        <div className="flex items-center justify-between gap-3 md:flex-col md:items-start md:gap-1">
          <span className="font-display text-[22px] font-semibold leading-tight">
            {masjid?.name ?? "Your masjid"}
          </span>
          <span className="text-[12.5px] text-muted">Admin dashboard</span>
        </div>
        <nav
          aria-label="Admin"
          className="-mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:flex-1 md:flex-col md:overflow-visible md:px-0"
        >
          {NAV.map(({ href, label, Icon, ...rest }) => {
            const exact = "exact" in rest && rest.exact;
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-none items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/80 hover:bg-default"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/profile"
          className="hidden rounded-2xl px-3.5 py-2.5 text-[13.5px] font-medium text-muted hover:bg-default md:block"
        >
          ← Back to the app
        </Link>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
