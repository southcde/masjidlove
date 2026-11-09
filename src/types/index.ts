export type Masjid = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  /** Minutes on foot; undefined when it needs transport */
  walkMinutes?: number;
  eventsThisWeek?: number;
  address?: string;
  phone?: string;
  /** Today's five jamaat times, 24h */
  todayJamaat?: { fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string };
  /** Next jamaat's change note, e.g. "Dhuhr +15" */
  timeChange?: { prayer: string; deltaMinutes: number; note: string };
};

export type Rsvp = "going" | "maybe" | "cant-go";

export type Event = {
  id: string;
  title: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  /** 24h time, e.g. "19:45" */
  time: string;
  masjidId: string;
  /** e.g. "Weekly" or "Volunteers needed" */
  kind?: string;
  description?: string;
  /** When, second line */
  whenNote?: string;
  whereNote?: string;
  goingCount: number;
  maybeCount: number;
  /** What the user answered. Mock state until the backend exists. */
  myRsvp?: Rsvp;
};

export type Quiz = { question: string; options: string[]; answer: number };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  kind: "video" | "reading" | "quiz";
  /** Body text shown on the lesson page */
  body: string;
  quiz?: Quiz;
};

export type Course = {
  id: string;
  title: string;
  teacher: string;
  level: "Beginner" | "Intermediate";
  category: string;
  summary: string;
  lessons: Lesson[];
};

export type ClassSession = {
  id: string;
  title: string;
  teacher: string;
  masjidId: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  /** 24h start time */
  time: string;
  durationMinutes: number;
  capacity: number;
  /** Seats already taken by other people */
  takenSeats: number;
  /** "Free" or a price like "R60" */
  price: string;
  audience: string;
  description: string;
  bring?: string;
};

export type OnboardingRole = "community" | "admin";

export type NotificationPreferences = {
  newEvents: boolean;
  eventReminders: boolean;
  jamaatChanges: boolean;
  dailySalah: boolean;
  reminderLead: "30min" | "1hour" | "morning";
};

export type UserState = {
  name: string;
  email: string;
  role: OnboardingRole | null;
  area: string;
  followedMasjidIds: string[];
  notifications: NotificationPreferences;
  /** Masjid ids bookmarked from Explore */
  savedMasjidIds: string[];
  /** Event RSVPs */
  rsvps: Record<string, Rsvp>;
  /** Events created by an admin on this device (no backend yet) */
  customEvents: Event[];
  /** Lesson ids the user has finished */
  completedLessons: string[];
  /** In-person class bookings: session id → seats held */
  bookings: Record<string, number>;
  /** Session ids the user is on the waitlist for */
  waitlist: string[];
  /** Published jamaat edits for the admin's masjid, keyed by prayer id, "HH:MM" */
  jamaatEdits: Partial<Record<PrayerId, string>>;
  /** Whether the published edits apply to the whole week or only today */
  jamaatEditsWholeWeek: boolean;
  /** True when the user declined location; Explore falls back to areas */
  locationDenied: boolean;
  onboardingComplete: boolean;
};

export type PrayerId = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "jumuah";

export const defaultUserState: UserState = {
  name: "",
  email: "",
  role: null,
  area: "",
  followedMasjidIds: [],
  notifications: {
    newEvents: true,
    eventReminders: true,
    jamaatChanges: true,
    dailySalah: false,
    reminderLead: "1hour",
  },
  savedMasjidIds: [],
  rsvps: {},
  customEvents: [],
  completedLessons: [],
  bookings: {},
  waitlist: [],
  jamaatEdits: {},
  jamaatEditsWholeWeek: true,
  locationDenied: false,
  onboardingComplete: false,
};

/** "Yusuf Adams" → "YA" */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
