"use client";

import Link from "next/link";
import { CountUp } from "@/components/app/count-up";
import { TabBar } from "@/components/app/tab-bar";
import { Scene, sceneFor } from "@/components/app/scene";
import { PatternArt } from "@/components/app/pattern-art";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { useUserState } from "@/hooks/use-user-state";
import {
  formatRand,
  KIND_COPY,
  listCauses,
  totalGiven,
} from "@/services/giving";
import {
  IconCalculator,
  IconChevronRight,
  IconCoins,
  IconDrop,
  IconHeart,
} from "@/components/icons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dayLabel(iso: string) {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function SupportPage() {
  useOnboardingGuard();
  const [state] = useUserState();
  const causes = listCauses(state.customCauses).slice(0, 3);
  const total = totalGiven(state.donations);
  const recent = [...state.donations].reverse().slice(0, 4);

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 pt-3">
        <PatternArt
          tone="gold"
          scene="hands"
          className="flex flex-col gap-1 rounded-[32px] p-5 pb-6 text-white shadow-lift"
        >
          <span className="relative text-[12.5px] font-medium text-white/75">
            {total > 0 ? "You’ve given" : "Give in the way of Allah"}
          </span>
          <span className="font-display relative text-[52px] font-semibold leading-none tracking-tight">
            {total > 0 ? <CountUp value={total} format={formatRand} /> : "Support"}
          </span>
          <span className="relative mt-1.5 max-w-[250px] text-[13.5px] leading-snug text-white/85">
            {total > 0
              ? "Through MasjidLove. May Allah accept it from you."
              : "Your masjid, a cause you care about, sadaqah or zakat — all in one place."}
          </span>
        </PatternArt>

        <section aria-label="Ways to give" className="grid grid-cols-2 gap-3">
          <Link
            href="/support/give?kind=masjid"
            className="relative row-span-2 flex flex-col justify-between overflow-hidden rounded-[28px] bg-art-emerald p-4 text-white shadow-premium"
          >
            <Scene name="masjid" />
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <IconHeart size={22} />
            </span>
            <span className="flex flex-col gap-1">
              <span className="font-display text-[22px] font-semibold leading-tight">
                {KIND_COPY.masjid.title}
              </span>
              <span className="text-[12.5px] leading-snug text-white/80">
                {KIND_COPY.masjid.blurb}
              </span>
            </span>
          </Link>
          {(
            [
              ["cause", IconDrop, "bg-art-teal"],
              ["sadaqah", IconCoins, "bg-art-gold"],
            ] as const
          ).map(([kind, Icon, bg]) => (
            <Link
              key={kind}
              href={`/support/give?kind=${kind}`}
              className={`relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-[28px] ${bg} p-4 text-white shadow-premium`}
            >
              <Scene name={kind === "cause" ? "drop" : "hands"} />
              <span className="relative">
                <Icon size={22} />
              </span>
              <span className="font-display relative text-[19px] font-semibold leading-tight">
                {KIND_COPY[kind].title}
              </span>
            </Link>
          ))}
          <Link
            href="/support/give?kind=zakat"
            className="col-span-2 flex items-center gap-3.5 rounded-[28px] bg-surface p-4 shadow-premium ring-1 ring-foreground/10"
          >
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gold-soft text-gold-foreground">
              <IconCoins size={24} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="font-display text-[20px] font-semibold">Zakat</span>
              <span className="text-[13px] text-muted">{KIND_COPY.zakat.blurb}</span>
            </span>
            <IconChevronRight size={16} />
          </Link>
        </section>

        <Link
          href="/support/zakat"
          className="flex items-center gap-3.5 rounded-3xl border border-dashed border-gold/60 bg-gold-soft p-4"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-background text-gold-foreground">
            <IconCalculator size={22} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="text-[15.5px] font-semibold text-gold-foreground">
              Not sure what you owe?
            </span>
            <span className="text-[13px] text-gold-foreground/80">
              Work out your zakat in a minute
            </span>
          </span>
          <IconChevronRight size={16} />
        </Link>

        <section className="flex flex-col gap-3" aria-label="Featured causes">
          <h2 className="font-display text-[22px] font-semibold">Needing support</h2>
          {causes.map((cause) => {
            const percent = Math.min(100, Math.round((cause.raised / cause.goal) * 100));
            return (
              <Link
                key={cause.id}
                href={`/support/give?kind=cause&target=${cause.id}`}
                className="flex flex-col gap-2.5 overflow-hidden rounded-3xl bg-background pb-4 shadow-premium ring-1 ring-foreground/10"
              >
                <PatternArt
                  tone={cause.tone}
                  scene={sceneFor(cause.name)}
                  className="h-[84px]"
                />
                <span className="font-display px-4 text-[18px] font-semibold leading-snug">
                  {cause.name}
                </span>
                <span className="px-4 text-[13.5px] leading-snug text-muted">
                  {cause.summary}
                </span>
                <div
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cause.name} funded`}
                  className="mx-4 h-2 overflow-hidden rounded-full bg-default"
                >
                  <div
                    className="bar-grow h-full rounded-full bg-gold"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="flex justify-between px-4 text-[12.5px]">
                  <span className="font-semibold">{formatRand(cause.raised)} raised</span>
                  <span className="text-muted">of {formatRand(cause.goal)}</span>
                </span>
              </Link>
            );
          })}
        </section>

        {recent.length > 0 && (
          <section className="flex flex-col gap-2" aria-label="Your giving">
            <h2 className="font-display text-[22px] font-semibold">Your giving</h2>
            <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-premium">
              {recent.map((donation, i) => (
                <div key={donation.id}>
                  {i > 0 && <div className="ml-4 h-px bg-separator" />}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="text-[15px] font-medium">{donation.targetName}</span>
                      <span className="text-[12.5px] text-muted">
                        {KIND_COPY[donation.kind].title} · {dayLabel(donation.at)}
                        {donation.monthly ? " · monthly" : ""}
                      </span>
                    </span>
                    <span className="font-display text-[17px] font-semibold">
                      {formatRand(donation.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="px-2 text-center text-[12px] leading-snug text-muted">
          Test build — no payment provider is connected, so no money moves.
        </p>
      </main>
      <TabBar active="support" />
    </div>
  );
}
