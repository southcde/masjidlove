"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { useUserState } from "@/hooks/use-user-state";
import { classWhen, getClass, seatsLeft } from "@/services/learning";
import { getMasjid } from "@/services/masjids";
import { IconCheck } from "@/components/icons";

const MAX_SEATS = 4;

export default function ClassPage() {
  const params = useParams<{ id: string }>();
  const [state, update] = useUserState();
  const [seats, setSeats] = useState(1);
  const [cancelOpen, setCancelOpen] = useState(false);

  const session = getClass(params.id);
  if (!session) {
    return (
      <OnboardingScreen back backHref="/learn">
        <p className="px-6 pt-4 text-muted">We couldn’t find that class.</p>
      </OnboardingScreen>
    );
  }

  const masjid = getMasjid(session.masjidId);
  const mine = state.bookings[session.id] ?? 0;
  const left = seatsLeft(session, mine);
  const onWaitlist = state.waitlist.includes(session.id);
  const maxPick = Math.min(MAX_SEATS, left);
  const pick = Math.min(seats, Math.max(1, maxPick));

  function book() {
    update({ bookings: { ...state.bookings, [session!.id]: pick } });
  }

  function cancel() {
    const next = { ...state.bookings };
    delete next[session!.id];
    update({ bookings: next });
    setCancelOpen(false);
  }

  function toggleWaitlist() {
    update({
      waitlist: onWaitlist
        ? state.waitlist.filter((id) => id !== session!.id)
        : [...state.waitlist, session!.id],
    });
  }

  const details: [string, string][] = [
    ["When", `${classWhen(session)} · ${session.durationMinutes} min`],
    ["Where", `${masjid?.name}, ${masjid?.area}`],
    ["Teacher", session.teacher],
    ["Who it’s for", session.audience],
    ["Cost", session.price],
    ...(session.bring ? ([["Bring", session.bring]] as [string, string][]) : []),
  ];

  return (
    <OnboardingScreen
      back
      backHref="/learn"
      footer={
        mine ? (
          <Button variant="outline" size="lg" fullWidth onPress={() => setCancelOpen(true)}>
            Cancel booking
          </Button>
        ) : left === 0 ? (
          <Button
            variant={onWaitlist ? "outline" : "primary"}
            size="lg"
            fullWidth
            onPress={toggleWaitlist}
          >
            {onWaitlist ? "Leave waitlist" : "Join waitlist"}
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth onPress={book}>
            Book {pick} seat{pick === 1 ? "" : "s"}
            {session.price === "Free" ? "" : ` · ${session.price} each`}
          </Button>
        )
      }
    >
      <div className="flex flex-1 flex-col gap-5 px-4 pb-4">
        <PatternArt
          tone={toneFor(session.id)}
          className="flex flex-col justify-end gap-2 rounded-3xl p-5 pt-14 text-white shadow-lift"
        >
          <span className="relative text-[12.5px] font-semibold text-white/80">
            In-person class
          </span>
          <h1 className="relative text-[27px] font-bold leading-tight">
            {session.title}
          </h1>
        </PatternArt>

        {mine > 0 && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-2xl bg-accent-soft p-4 text-accent-soft-foreground"
          >
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent text-accent-foreground">
              <IconCheck size={18} />
            </span>
            <span className="text-[14.5px] font-medium">
              You’re booked — {mine} seat{mine === 1 ? "" : "s"} held. Free to
              cancel until the day before.
            </span>
          </div>
        )}
        {onWaitlist && left === 0 && (
          <div role="status" className="rounded-2xl bg-gold-soft p-4 text-[14.5px] font-medium text-gold-foreground">
            You’re on the waitlist. We’ll tell you if a seat opens up.
          </div>
        )}

        <p className="text-[15.5px] leading-relaxed text-foreground/90">
          {session.description}
        </p>

        <dl className="overflow-hidden rounded-3xl bg-background shadow-premium ring-1 ring-black/5">
          {details.map(([term, value], i) => (
            <div
              key={term}
              className={`flex gap-4 px-4 py-3.5 ${i > 0 ? "border-t border-separator" : ""}`}
            >
              <dt className="w-[92px] flex-none text-[13.5px] text-muted">{term}</dt>
              <dd className="text-[15px] font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        {!mine && left > 0 && (
          <section className="flex flex-col gap-2.5" aria-label="Seats">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[19px] font-semibold">
                How many seats?
              </h2>
              <span className="text-[13px] text-muted">
                {left} left of {session.capacity}
              </span>
            </div>
            <ToggleButtonGroup
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={new Set([String(pick)])}
              onSelectionChange={(keys) => {
                const key = Array.from(keys as Set<string>)[0];
                if (key) setSeats(Number(key));
              }}
              aria-label="Number of seats"
              className="grid grid-cols-4 gap-2"
            >
              {Array.from({ length: MAX_SEATS }, (_, i) => i + 1).map((n) => (
                <ToggleButton
                  key={n}
                  id={String(n)}
                  variant="default"
                  isDisabled={n > maxPick}
                  className="min-h-[48px] rounded-2xl text-[16px] font-semibold data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  {n}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </section>
        )}
      </div>

      <AlertDialog isOpen={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Cancel your booking?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Your {mine} seat{mine === 1 ? "" : "s"} will be released for
                other people.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="outline" onPress={() => setCancelOpen(false)}>
                  Keep booking
                </Button>
                <Button variant="danger" onPress={cancel}>
                  Cancel booking
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </OnboardingScreen>
  );
}
