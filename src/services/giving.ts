import type { Donation, DonationKind } from "@/types";

// Mock data until Supabase and a payment provider exist (SETUP.md §10).
// Causes, goals and amounts raised are placeholders.

export type Cause = {
  id: string;
  name: string;
  summary: string;
  /** Rand */
  goal: number;
  raised: number;
  /** Whether it can receive zakat. Scholars differ on edge cases; the app
   *  only lists funds that serve people in need directly. */
  zakatEligible: boolean;
  tone: "emerald" | "teal" | "gold";
};

const CAUSES: Cause[] = [
  {
    id: "emergency-relief",
    name: "Emergency relief",
    summary:
      "Food parcels, blankets and shelter for families hit by floods and fires this season.",
    goal: 250000,
    raised: 171500,
    zakatEligible: true,
    tone: "gold",
  },
  {
    id: "soup-kitchen",
    name: "Soup kitchen",
    summary:
      "400 hot meals packed every second Saturday and delivered across the neighbourhood.",
    goal: 60000,
    raised: 38200,
    zakatEligible: true,
    tone: "emerald",
  },
  {
    id: "madrasah-bursaries",
    name: "Madrasah bursaries",
    summary:
      "Covers a year of fees and books for children whose families cannot afford them.",
    goal: 120000,
    raised: 54300,
    zakatEligible: true,
    tone: "teal",
  },
  {
    id: "water-wells",
    name: "Clean water wells",
    summary:
      "A well gives a village clean water for years — an ongoing charity that keeps giving.",
    goal: 90000,
    raised: 66900,
    zakatEligible: false,
    tone: "teal",
  },
  {
    id: "orphan-care",
    name: "Orphan care",
    summary:
      "Monthly support for orphans: schooling, healthcare and a steady adult in their corner.",
    goal: 180000,
    raised: 98400,
    zakatEligible: true,
    tone: "gold",
  },
];

export const PRESET_AMOUNTS = [50, 100, 250, 500, 1000] as const;

export const KIND_COPY: Record<
  DonationKind,
  { title: string; blurb: string; recipientLabel: string }
> = {
  masjid: {
    title: "Your masjid",
    blurb: "Keep the lights on, the carpets clean and the doors open.",
    recipientLabel: "Which masjid?",
  },
  cause: {
    title: "A cause",
    blurb: "Fund a specific project, start to finish.",
    recipientLabel: "Which cause?",
  },
  sadaqah: {
    title: "Sadaqah",
    blurb: "Voluntary charity, given wherever it is needed most.",
    recipientLabel: "",
  },
  zakat: {
    title: "Zakat",
    blurb: "Your obligatory charity, to those who qualify.",
    recipientLabel: "Which fund?",
  },
};

export function listCauses(): Cause[] {
  return CAUSES;
}

export function getCause(id: string): Cause | undefined {
  return CAUSES.find((c) => c.id === id);
}

export function listZakatCauses(): Cause[] {
  return CAUSES.filter((c) => c.zakatEligible);
}

export function formatRand(amount: number): string {
  return `R${Math.round(amount).toLocaleString("en-ZA").replace(/ /g, " ")}`;
}

export function totalGiven(donations: Donation[]): number {
  return donations.reduce((sum, d) => sum + d.amount, 0);
}

/** Silver nisab in grams (612.36 g, the common Hanafi/Shafiʿi measure). */
export const NISAB_SILVER_GRAMS = 612.36;
export const ZAKAT_RATE = 0.025;

export type ZakatInput = {
  cash: number;
  gold: number;
  silver: number;
  investments: number;
  owedToYou: number;
  debts: number;
  silverPricePerGram: number;
};

export function calculateZakat(input: ZakatInput) {
  const assets =
    input.cash + input.gold + input.silver + input.investments + input.owedToYou;
  const net = Math.max(0, assets - input.debts);
  const nisab = NISAB_SILVER_GRAMS * input.silverPricePerGram;
  const hasNisabPrice = input.silverPricePerGram > 0;
  const due = hasNisabPrice && net >= nisab ? net * ZAKAT_RATE : 0;
  return { assets, net, nisab, hasNisabPrice, due, aboveNisab: net >= nisab };
}

/** Build a donation record. Kept here so components stay free of clock calls. */
export function createDonation(
  fields: Omit<Donation, "id" | "at">
): Donation {
  return {
    ...fields,
    id: `d-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
  };
}
