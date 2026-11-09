"use client";

import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h1 className="text-[30px] font-bold leading-tight md:text-[36px]">{title}</h1>
        {subtitle && <p className="text-[14.5px] text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  note?: string;
  tone?: "default" | "accent" | "gold";
}) {
  const toneClass =
    tone === "accent"
      ? "bg-art-emerald text-white"
      : tone === "gold"
        ? "bg-art-gold text-white"
        : "bg-background ring-1 ring-foreground/10";
  const muted = tone === "default" ? "text-muted" : "text-white/75";
  return (
    <div className={`flex flex-col gap-1.5 rounded-3xl p-5 shadow-premium ${toneClass}`}>
      <span className={`text-[13px] font-medium ${muted}`}>{label}</span>
      <span className="font-display text-[34px] font-semibold leading-none">{value}</span>
      {note && <span className={`text-[12.5px] ${muted}`}>{note}</span>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex min-w-0 flex-col gap-4 rounded-3xl bg-background p-5 shadow-premium ring-1 ring-foreground/10 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-[22px] font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "warn" | "muted" | "bad";
  children: ReactNode;
}) {
  const cls = {
    good: "bg-accent-soft text-accent-soft-foreground",
    warn: "bg-gold-soft text-gold-foreground",
    muted: "bg-default text-muted",
    bad: "bg-danger/10 text-danger",
  }[tone];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

/** Plain semantic table with the dashboard's styling. Scrolls sideways on phones. */
export function DataTable({
  columns,
  children,
  empty,
}: {
  columns: string[];
  children: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-separator text-[12px] font-semibold uppercase tracking-wide text-muted">
            {columns.map((c) => (
              <th key={c} scope="col" className="px-3 py-2.5 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-separator">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function Td({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-3 align-middle ${className}`}>{children}</td>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-3 py-8 text-center text-[14px] text-muted">{children}</p>;
}
