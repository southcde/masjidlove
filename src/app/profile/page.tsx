"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Button,
  Chip,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { PatternArt } from "@/components/app/pattern-art";
import { TabBar } from "@/components/app/tab-bar";
import { useUserState } from "@/hooks/use-user-state";
import { defaultUserState, initialsOf } from "@/types";
import { getMasjid } from "@/services/masjids";
import { getEvent } from "@/services/events";
import { IconAdmin, IconCheck, IconChevronRight, IconQuestion } from "@/components/icons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(iso: string, time: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}, ${time}`;
}

function SectionLabel({
  children,
  action,
}: {
  children: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-baseline justify-between px-0.5">
      <h2 className="text-[13.5px] font-medium text-muted">{children}</h2>
      {action && (
        <Link href={action.href} className="text-[13.5px] font-medium text-link">
          {action.label}
        </Link>
      )}
    </div>
  );
}

const rowClass =
  "flex min-h-[56px] items-center gap-3 px-4 py-2.5 active:bg-default";

export default function ProfilePage() {
  useOnboardingGuard();
  const router = useRouter();
  const [state, update] = useUserState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.name);

  const name = state.name || "Your name";
  const followed = state.followedMasjidIds
    .map((id) => getMasjid(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const rsvps = Object.entries(state.rsvps)
    .map(([id, rsvp]) => ({ event: getEvent(id, state.customEvents), rsvp }))
    .filter(
      (r): r is { event: NonNullable<typeof r.event>; rsvp: typeof r.rsvp } =>
        Boolean(r.event)
    );

  const adminMasjid = getMasjid(state.followedMasjidIds[0] ?? "masjidul-quds");
  const activeNotifications = Object.entries(state.notifications).filter(
    ([key, value]) => key !== "reminderLead" && value === true
  ).length;

  function saveName() {
    update({ name: draft.trim() });
    setEditing(false);
  }

  function logOut() {
    update({ ...defaultUserState });
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4 pt-3">
        <PatternArt tone="emerald" className="-mx-4 -mt-3 rounded-b-[32px] px-5 pb-8 pt-7">
        <header className="relative flex items-center gap-3.5">
          <Avatar className="h-14 w-14 flex-none ring-2 ring-gold">
            <AvatarFallback className="!bg-white/20 text-lg font-semibold !text-white">
              {initialsOf(state.name) || "ML"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="font-display truncate text-[26px] font-semibold leading-tight text-white">
              {name}
            </span>
            <span className="truncate text-[13px] text-white/75">
              {state.email || "No email added"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/15 text-white backdrop-blur"
            onPress={() => {
              setDraft(state.name);
              setEditing((v) => !v);
            }}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
        </header>
        </PatternArt>

        {editing && (
          <div className="flex flex-col gap-3 rounded-3xl border border-foreground/10 shadow-premium bg-surface p-4">
            <TextField
              value={draft}
              onChange={setDraft}
              className="flex flex-col gap-2"
            >
              <Label>Your name</Label>
              <Input autoComplete="name" />
            </TextField>
            <Button variant="primary" onPress={saveName} isDisabled={!draft.trim()}>
              Save
            </Button>
          </div>
        )}

        {state.role === "admin" && adminMasjid && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-2xl border-2 border-accent bg-accent-soft p-4"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <IconAdmin size={22} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[15.5px] font-semibold text-accent-soft-foreground">
                Masjid admin
              </span>
              <span className="text-[13px] text-accent-soft-foreground">
                {adminMasjid.name} · post events, edit times
              </span>
            </span>
            <IconChevronRight size={18} />
          </Link>
        )}

        <section className="flex flex-col gap-2" aria-label="Masjids you follow">
          <SectionLabel action={{ href: "/explore", label: "Add" }}>
            Masjids you follow
          </SectionLabel>
          <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
            {followed.length === 0 && (
              <div className="px-4 py-4 text-[14px] text-muted">
                You’re not following any masjids yet.{" "}
                <Link href="/explore" className="font-medium text-link">
                  Find one
                </Link>
              </div>
            )}
            {followed.map((masjid, index) => (
              <div key={masjid.id}>
                {index > 0 && <div className="ml-4 h-px bg-separator" />}
                <Link href={`/masjid/${masjid.id}`} className={rowClass}>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[15.5px] font-medium">{masjid.name}</span>
                    <span className="text-[13px] text-muted">{masjid.area}</span>
                  </span>
                  {index === 0 && (
                    <Chip
                      variant="secondary"
                      className="bg-accent-soft text-[12.5px] font-semibold text-accent-soft-foreground"
                    >
                      Home
                    </Chip>
                  )}
                  <IconChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2" aria-label="Your RSVPs">
          <SectionLabel>Your RSVPs</SectionLabel>
          <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
            {rsvps.length === 0 && (
              <div className="px-4 py-4 text-[14px] text-muted">
                Nothing yet.{" "}
                <Link href="/events" className="font-medium text-link">
                  See what’s on
                </Link>
              </div>
            )}
            {rsvps.map(({ event, rsvp }, index) => (
              <div key={event.id}>
                {index > 0 && <div className="ml-4 h-px bg-separator" />}
                <Link href={`/events/${event.id}`} className={rowClass}>
                  <span className="flex min-w-0 flex-1 flex-col gap-px">
                    <span className="text-[15.5px] font-medium">{event.title}</span>
                    <span className="text-[13px] text-muted">
                      {shortDate(event.date, event.time)}
                    </span>
                  </span>
                  {rsvp === "going" ? (
                    <Chip
                      variant="secondary"
                      className="gap-1 bg-accent-soft text-[12.5px] font-semibold text-accent-soft-foreground"
                    >
                      <IconCheck size={14} />
                      Going
                    </Chip>
                  ) : rsvp === "maybe" ? (
                    <Chip
                      variant="secondary"
                      className="gap-1 bg-warning-soft text-[12.5px] font-semibold text-warning-soft-foreground"
                    >
                      <IconQuestion size={14} />
                      Maybe
                    </Chip>
                  ) : (
                    <span className="text-[12.5px] text-muted">Can’t go</span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2" aria-label="Settings">
          <SectionLabel>Settings</SectionLabel>
          <div className="overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface">
            <Link href="/settings" className={rowClass}>
              <span className="flex-1 text-[15.5px] font-medium">
                Appearance and settings
              </span>
              <span className="text-[13px] text-muted">
                {state.settings.theme === "system"
                  ? "Auto"
                  : state.settings.theme === "dark"
                    ? "Dark"
                    : "Light"}
              </span>
              <IconChevronRight size={16} />
            </Link>
            <div className="ml-4 h-px bg-separator" />
            <Link href="/notifications?from=profile" className={rowClass}>
              <span className="flex-1 text-[15.5px] font-medium">Notifications</span>
              <span className="text-[13px] text-muted">
                {activeNotifications} on
              </span>
              <IconChevronRight size={16} />
            </Link>
            <div className="ml-4 h-px bg-separator" />
            <button type="button" onClick={logOut} className={`${rowClass} w-full text-left`}>
              <span className="flex-1 text-[15.5px] font-medium text-danger">
                Log out
              </span>
            </button>
          </div>
        </section>
      </main>
      <TabBar active="profile" />
    </div>
  );
}
