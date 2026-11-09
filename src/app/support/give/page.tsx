"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Button,
  Description,
  Input,
  Label,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { Hydrated } from "@/components/app/hydrated";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useUserState } from "@/hooks/use-user-state";
import {
  createDonation,
  formatRand,
  KIND_COPY,
  listCauses,
  listZakatCauses,
  PRESET_AMOUNTS,
} from "@/services/giving";
import { listMasjids } from "@/services/masjids";
import type { DonationKind } from "@/types";

const KINDS: DonationKind[] = ["masjid", "cause", "sadaqah", "zakat"];

function GiveScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const [state, update] = useUserState();

  const kindParam = params.get("kind") as DonationKind | null;
  const kind: DonationKind = KINDS.includes(kindParam as DonationKind)
    ? (kindParam as DonationKind)
    : "masjid";
  const presetAmount = Number(params.get("amount")) || 0;

  const masjids = listMasjids();
  const options =
    kind === "masjid"
      ? masjids.map((m) => ({ id: m.id, name: m.name, note: m.area }))
      : kind === "cause"
        ? listCauses().map((c) => ({ id: c.id, name: c.name, note: "" }))
        : kind === "zakat"
          ? listZakatCauses().map((c) => ({ id: c.id, name: c.name, note: "" }))
          : [];

  const defaultTarget =
    params.get("target") ??
    (kind === "masjid" ? (state.followedMasjidIds[0] ?? options[0]?.id) : options[0]?.id) ??
    "";
  const [target, setTarget] = useState(defaultTarget);
  const [amount, setAmount] = useState<number>(
    presetAmount || (PRESET_AMOUNTS[2] as number)
  );
  const [custom, setCustom] = useState(presetAmount && !PRESET_AMOUNTS.includes(presetAmount as never) ? String(presetAmount) : "");
  const [monthly, setMonthly] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effective = custom ? Number(custom) : amount;
  const recipient = options.find((o) => o.id === target);
  const targetName =
    kind === "sadaqah"
      ? "General sadaqah"
      : kind === "zakat" && !recipient
        ? "Zakat"
        : (recipient?.name ?? "");

  function give() {
    if (!Number.isFinite(effective) || effective < 10) {
      setError("Enter an amount of at least R10.");
      return;
    }
    if (kind !== "sadaqah" && !recipient) {
      setError("Choose where it should go.");
      return;
    }
    const donation = createDonation({
      kind,
      targetId: recipient?.id ?? "",
      targetName,
      amount: Math.round(effective),
      monthly,
    });
    update({ donations: [...state.donations, donation] });
    router.push(`/support/thanks?id=${donation.id}`);
  }

  return (
    <OnboardingScreen
      back
      backHref="/support"
      footer={
        <Button variant="primary" size="lg" fullWidth onPress={give}>
          Give {Number.isFinite(effective) && effective > 0 ? formatRand(effective) : ""}
          {monthly ? " every month" : ""}
        </Button>
      }
    >
      <div className="flex flex-1 flex-col gap-6 px-4 pb-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[30px] font-bold leading-tight">
            {KIND_COPY[kind].title}
          </h1>
          <p className="text-[14.5px] leading-snug text-muted">
            {KIND_COPY[kind].blurb}
          </p>
        </div>

        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={new Set([kind])}
          onSelectionChange={(keys) => {
            const key = Array.from(keys as Set<string>)[0];
            if (key) router.replace(`/support/give?kind=${key}`);
          }}
          aria-label="Type of giving"
          className="grid grid-cols-4 gap-1 rounded-2xl bg-default p-1"
        >
          {KINDS.map((k) => (
            <ToggleButton
              key={k}
              id={k}
              variant="default"
              className="min-h-[40px] rounded-xl bg-transparent px-1 text-[12.5px] font-medium shadow-none data-[selected=true]:bg-background data-[selected=true]:font-semibold data-[selected=true]:shadow-premium"
            >
              {k === "masjid" ? "Masjid" : k === "cause" ? "Cause" : k === "sadaqah" ? "Sadaqah" : "Zakat"}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {options.length > 0 && (
          <section className="flex flex-col gap-2.5" aria-label="Recipient">
            <h2 className="font-display text-[19px] font-semibold">
              {KIND_COPY[kind].recipientLabel}
            </h2>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label={KIND_COPY[kind].recipientLabel}>
              {options.map((option) => {
                const selected = option.id === target;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setTarget(option.id)}
                    className={`flex min-h-[54px] items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left ring-1 transition-colors ${
                      selected
                        ? "bg-accent-soft ring-2 ring-accent"
                        : "bg-background ring-foreground/10 active:bg-default"
                    }`}
                  >
                    <span className="text-[15.5px] font-medium">{option.name}</span>
                    {option.note && (
                      <span className="text-[12.5px] text-muted">{option.note}</span>
                    )}
                  </button>
                );
              })}
            </div>
            {kind === "zakat" && (
              <p className="px-1 text-[12.5px] leading-snug text-muted">
                Only funds that serve people in need directly are listed. If
                you’re unsure, ask your local scholar.
              </p>
            )}
          </section>
        )}

        <section className="flex flex-col gap-3" aria-label="Amount">
          <h2 className="font-display text-[19px] font-semibold">How much?</h2>
          <ToggleButtonGroup
            selectionMode="single"
            selectedKeys={new Set(custom ? [] : [String(amount)])}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0];
              if (key) {
                setAmount(Number(key));
                setCustom("");
                setError(null);
              }
            }}
            aria-label="Amount"
            className="grid grid-cols-3 gap-2"
          >
            {PRESET_AMOUNTS.map((value) => (
              <ToggleButton
                key={value}
                id={String(value)}
                variant="default"
                className="font-display min-h-[52px] rounded-2xl text-[19px] font-semibold data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                {formatRand(value)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField
            value={custom}
            onChange={(v) => {
              setCustom(v.replace(/[^0-9]/g, ""));
              setError(null);
            }}
            isInvalid={error !== null}
            className="flex flex-col gap-2"
          >
            <Label>Or enter your own amount (R)</Label>
            <Input inputMode="numeric" placeholder="e.g. 350" />
            {error && <Description className="text-danger">{error}</Description>}
          </TextField>
        </section>

        {kind !== "zakat" && (
          <Switch
            isSelected={monthly}
            onChange={setMonthly}
            className="flex items-center gap-3 rounded-2xl bg-gold-soft p-4"
          >
            <Switch.Content className="flex w-full items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Label className="text-[15px] font-semibold text-gold-foreground">
                  Make it monthly
                </Label>
                <Description className="text-[13px] leading-snug text-gold-foreground/80">
                  Sadaqah jāriyah — small, steady giving that keeps going.
                </Description>
              </div>
              <Switch.Control className="shrink-0">
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        )}

        <p className="text-center text-[12px] leading-snug text-muted">
          Test build — no payment provider is connected, so no money moves.
        </p>
      </div>
    </OnboardingScreen>
  );
}

function KeyedGive() {
  // Remount when the type changes so the recipient list and selection reset.
  const params = useSearchParams();
  return <GiveScreen key={params.toString()} />;
}

export default function GivePage() {
  return (
    <Suspense fallback={null}>
      <Hydrated>
        <KeyedGive />
      </Hydrated>
    </Suspense>
  );
}
