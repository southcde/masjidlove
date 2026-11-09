"use client";

import { useState } from "react";
import { Description, Input, Label, TextField } from "@heroui/react";
import { LinkButton } from "@/components/link-button";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { PatternArt } from "@/components/app/pattern-art";
import {
  calculateZakat,
  formatRand,
  NISAB_SILVER_GRAMS,
  ZAKAT_RATE,
} from "@/services/giving";

type FieldKey =
  | "cash"
  | "gold"
  | "silver"
  | "investments"
  | "owedToYou"
  | "debts"
  | "silverPricePerGram";

const FIELDS: { key: FieldKey; label: string; hint: string }[] = [
  { key: "cash", label: "Cash and savings", hint: "Bank balances and cash in hand" },
  { key: "gold", label: "Gold", hint: "Current value of gold you own" },
  { key: "silver", label: "Silver", hint: "Current value of silver you own" },
  {
    key: "investments",
    label: "Investments and business stock",
    hint: "Shares, funds and goods held for sale",
  },
  { key: "owedToYou", label: "Money owed to you", hint: "Loans you expect to get back" },
  { key: "debts", label: "Debts you owe now", hint: "Subtracted from the total" },
];

function num(value: string): number {
  const n = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function ZakatCalculatorPage() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    cash: "",
    gold: "",
    silver: "",
    investments: "",
    owedToYou: "",
    debts: "",
    silverPricePerGram: "",
  });

  const result = calculateZakat({
    cash: num(values.cash),
    gold: num(values.gold),
    silver: num(values.silver),
    investments: num(values.investments),
    owedToYou: num(values.owedToYou),
    debts: num(values.debts),
    silverPricePerGram: num(values.silverPricePerGram),
  });

  function set(key: FieldKey, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <OnboardingScreen
      back
      backHref="/support"
      footer={
        <LinkButton
          href={`/support/give?kind=zakat&amount=${Math.round(result.due)}`}
          variant="primary"
          size="lg"
          fullWidth
          isDisabled={result.due <= 0}
        >
          {result.due > 0 ? `Give ${formatRand(result.due)} as zakat` : "Give zakat"}
        </LinkButton>
      }
    >
      <div className="flex flex-1 flex-col gap-6 px-4 pb-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[30px] font-bold leading-tight">Zakat calculator</h1>
          <p className="text-[14.5px] leading-snug text-muted">
            Zakat is {ZAKAT_RATE * 100}% of the wealth you’ve held for a full
            lunar year, once it passes the nisab. Fill in what applies; leave
            the rest blank.
          </p>
        </div>

        <PatternArt
          tone="gold"
          className="flex flex-col gap-1 rounded-[28px] p-5 text-white shadow-lift"
        >
          <span className="relative text-[12.5px] font-medium text-white/75">
            Zakat due
          </span>
          <span className="font-display relative text-[46px] font-semibold leading-none">
            {formatRand(result.due)}
          </span>
          <span className="relative mt-1 text-[13px] leading-snug text-white/85">
            {!result.hasNisabPrice
              ? "Add today’s silver price below to check the nisab."
              : result.aboveNisab
                ? `Your net wealth of ${formatRand(result.net)} is above the nisab of ${formatRand(result.nisab)}.`
                : `Your net wealth of ${formatRand(result.net)} is below the nisab of ${formatRand(result.nisab)}, so zakat isn’t due.`}
          </span>
        </PatternArt>

        <div className="flex flex-col gap-4">
          {FIELDS.map((field) => (
            <TextField
              key={field.key}
              value={values[field.key]}
              onChange={(v) => set(field.key, v)}
              className="flex flex-col gap-2"
            >
              <Label>{field.label}</Label>
              <Input inputMode="decimal" placeholder="R 0" />
              <Description>{field.hint}</Description>
            </TextField>
          ))}

          <TextField
            value={values.silverPricePerGram}
            onChange={(v) => set("silverPricePerGram", v)}
            className="flex flex-col gap-2"
          >
            <Label>Silver price per gram (R)</Label>
            <Input inputMode="decimal" placeholder="Check today’s price" />
            <Description>
              The nisab is {NISAB_SILVER_GRAMS} g of silver, so it moves with
              the market. Look up today’s price.
            </Description>
          </TextField>
        </div>

        <p className="text-[12.5px] leading-snug text-muted">
          This is a guide, not a ruling. Scholars differ on some assets — ask
          yours if you’re unsure.
        </p>
      </div>
    </OnboardingScreen>
  );
}
