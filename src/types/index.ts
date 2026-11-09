export type Masjid = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  /** WGS84 coordinates, used by the map */
  lat: number;
  lng: number;
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
  /** Set by an admin; hidden from the public lists */
  cancelled?: boolean;
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
  /** Set by an admin; hidden from the public lists */
  cancelled?: boolean;
};

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

export type Announcement = {
  id: string;
  masjidId: string;
  title: string;
  body: string;
  /** ISO timestamp */
  at: string;
};

/** Details an admin can edit about their masjid. */
export type MasjidProfile = {
  address?: string;
  phone?: string;
  about?: string;
  jumuahNote?: string;
};

export type OnboardingRole = "community" | "admin";

export type NotificationPreferences = {
  newEvents: boolean;
  eventReminders: boolean;
  jamaatChanges: boolean;
  dailySalah: boolean;
  reminderLead: "30min" | "1hour" | "morning";
};

export type ThemeChoice = "system" | "light" | "dark";
export type TextSize = "default" | "large" | "larger";

export type AppSettings = {
  theme: ThemeChoice;
  textSize: TextSize;
  reduceMotion: boolean;
};

export type DonationKind = "masjid" | "cause" | "sadaqah" | "zakat";

export type Donation = {
  id: string;
  kind: DonationKind;
  /** Masjid id or cause id; empty for general sadaqah/zakat */
  targetId: string;
  /** Display name of where it went, saved so history survives data changes */
  targetName: string;
  /** Whole rand */
  amount: number;
  monthly: boolean;
  /** ISO timestamp */
  at: string;
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
  /** Admin edits to any event (seed or custom), keyed by event id */
  eventEdits: Record<string, Partial<Event>>;
  /** Classes created by an admin on this device */
  customClasses: ClassSession[];
  /** Admin edits to any class, keyed by class id */
  classEdits: Record<string, Partial<ClassSession>>;
  /** Causes created by an admin on this device */
  customCauses: Cause[];
  announcements: Announcement[];
  /** Admin edits to masjid details, keyed by masjid id */
  masjidProfile: Record<string, MasjidProfile>;
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
  settings: AppSettings;
  /** Giving history. Test mode: no payment provider is connected. */
  donations: Donation[];
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
  eventEdits: {},
  customClasses: [],
  classEdits: {},
  customCauses: [],
  announcements: [],
  masjidProfile: {},
  completedLessons: [],
  bookings: {},
  waitlist: [],
  jamaatEdits: {},
  jamaatEditsWholeWeek: true,
  locationDenied: false,
  settings: { theme: "system", textSize: "default", reduceMotion: false },
  donations: [],
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
