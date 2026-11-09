import type { PrayerId } from "@/types";

// Mock jamaat week data until Supabase + PostGIS exist (SETUP.md §10).

export type JamaatWeek = {
  /** e.g. "Mon 31 Aug – Sun 6 Sep" */
  label: string;
  /** day → 5 prayer times; delta = minutes vs same day last week */
  days: {
    day: string;
    date: number;
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    /** index of the delta (0..4) and its signed minutes, when moved */
    delta?: { prayer: 0 | 1 | 2 | 3 | 4; minutes: number };
  }[];
};

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Mag", "Isha"] as const;

export const prayerNames = PRAYERS;

export const jamaatWeekQuds: JamaatWeek = {
  label: "Mon 31 Aug – Sun 6 Sep",
  days: [
    { day: "Mon 31", date: 31, fajr: "05:42", dhuhr: "13:15", asr: "16:30", maghrib: "18:22", isha: "19:40" },
    { day: "Tue 1", date: 1, fajr: "05:42", dhuhr: "13:15", asr: "16:30", maghrib: "18:23", isha: "19:40" },
    { day: "Wed 2", date: 2, fajr: "05:42", dhuhr: "13:15", asr: "16:30", maghrib: "18:24", isha: "19:40" },
    { day: "Thu 3", date: 3, fajr: "05:42", dhuhr: "13:15", asr: "16:45", maghrib: "18:25", isha: "19:40", delta: { prayer: 2, minutes: 15 } },
    { day: "Fri 4", date: 4, fajr: "05:41", dhuhr: "12:45", asr: "16:30", maghrib: "18:26", isha: "19:40", delta: { prayer: 1, minutes: -30 } },
    { day: "Sat 5", date: 5, fajr: "05:40", dhuhr: "13:15", asr: "16:45", maghrib: "18:27", isha: "20:00", delta: { prayer: 4, minutes: 20 } },
    { day: "Sun 6", date: 6, fajr: "05:39", dhuhr: "13:15", asr: "16:45", maghrib: "18:28", isha: "20:00" },
  ],
};

export const jamaatWeekQudsNext: JamaatWeek = {
  label: "Mon 7 Sep – Sun 13 Sep",
  days: jamaatWeekQuds.days.map((d) => ({
    ...d,
    day: d.day.replace(/ \d+$/, (m) => String(Number(m.slice(2)) + 7)),
    date: d.date + 7,
  })),
};

/** Friday Dhuhr note, per the spec */
export const jumuahNote = "Friday Dhuhr is Jumuʿah — 12:45, khutbah in English.";

const KEYS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Layer an admin's published edits over the mock week. Mock "today" is Thu 3. */
export function applyJamaatEdits(
  week: JamaatWeek,
  edits: Partial<Record<PrayerId, string>>,
  wholeWeek: boolean
): JamaatWeek {
  if (Object.keys(edits).length === 0) return week;
  return {
    ...week,
    days: week.days.map((day) => {
      if (!wholeWeek && day.date !== 3) return day;
      const next = { ...day };
      let delta = day.delta;
      KEYS.forEach((key, index) => {
        const edit = edits[key];
        const isFriday = day.day.startsWith("Fri");
        const value = key === "dhuhr" && isFriday ? edits.jumuah : edit;
        if (value && value !== day[key]) {
          delta = {
            prayer: index as 0 | 1 | 2 | 3 | 4,
            minutes: toMinutes(value) - toMinutes(day[key]),
          };
          next[key] = value;
        }
      });
      return { ...next, delta };
    }),
  };
}
