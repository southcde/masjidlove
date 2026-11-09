import type { Cause, Donation, DonationKind } from "@/types";

// Mock data until Supabase and a payment provider exist (SETUP.md §10).
// Causes, goals and amounts raised are placeholders.

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

export function listCauses(extra: Cause[] = []): Cause[] {
  return [...CAUSES, ...extra];
}

export function getCause(id: string, extra: Cause[] = []): Cause | undefined {
  return listCauses(extra).find((c) => c.id === id);
}

export function listZakatCauses(extra: Cause[] = []): Cause[] {
  return listCauses(extra).filter((c) => c.zakatEligible);
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

// ---- Admin giving (sample data until the database and payments exist) ----

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Sample monthly totals for the last six months, oldest first. */
const SAMPLE_MONTHLY = [18400, 21250, 19800, 26300, 31100, 24750];

export type MonthTotal = { key: string; label: string; amount: number };

/** Last six months of giving to a masjid: sample base plus gifts made on this device. */
export function monthlyGiving(
  donations: Donation[],
  masjidId: string,
  now: Date = new Date()
): MonthTotal[] {
  return SAMPLE_MONTHLY.map((base, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const mine = donations
      .filter((x) => x.kind === "masjid" && x.targetId === masjidId && x.at.startsWith(key))
      .reduce((sum, x) => sum + x.amount, 0);
    return { key, label: MONTH_NAMES[d.getMonth()], amount: base + mine };
  });
}

export type SampleGift = {
  id: string;
  who: string;
  kind: DonationKind;
  amount: number;
  monthly: boolean;
  when: string;
};

/** Anonymous sample gifts shown to admins. Donor names are never shown. */
export const SAMPLE_GIFTS: SampleGift[] = [
  { id: "s1", who: "Anonymous donor", kind: "masjid", amount: 500, monthly: true, when: "Today" },
  { id: "s2", who: "Anonymous donor", kind: "masjid", amount: 150, monthly: false, when: "Yesterday" },
  { id: "s3", who: "Anonymous donor", kind: "sadaqah", amount: 100, monthly: false, when: "2 days ago" },
  { id: "s4", who: "Anonymous donor", kind: "masjid", amount: 1000, monthly: true, when: "4 days ago" },
  { id: "s5", who: "Anonymous donor", kind: "cause", amount: 250, monthly: false, when: "6 days ago" },
];
