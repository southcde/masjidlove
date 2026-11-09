import type { Event } from "@/types";

// Mock data until Supabase exists (SETUP.md §10).

const EVENTS: Event[] = [
  {
    id: "tafsir-yusuf",
    title: "Tafsīr of Sūrah Yūsuf",
    date: "2026-09-10",
    time: "19:45",
    masjidId: "masjidul-quds",
    kind: "Weekly",
    description:
      "Shaykh Ismail Londt continues the weekly tafsīr, working verse by verse through Sūrah Yūsuf this term. Everyone is welcome — seating for women upstairs. No registration, no charge. Tea afterwards in the courtyard.",
    whenNote: "After Isha jamaat · about 45 min",
    whereNote: "18 Duine Rd, Gatesville",
    goingCount: 42,
    maybeCount: 6,
    myRsvp: "going",
  },
  {
    id: "soup-kitchen",
    title: "Soup kitchen — packing day",
    date: "2026-09-12",
    time: "09:00",
    masjidId: "masjidus-sunni",
    kind: "Volunteers needed",
    description:
      "We pack 400 soup packs for the surrounding neighbourhood every second Saturday. Gloves and aprons provided — bring a cap for the yard. An hour of your morning makes a real difference.",
    whenNote: "Until about 11:30 · yard behind the hall",
    whereNote: "Masjidus Sunni, Rylands",
    goingCount: 18,
    maybeCount: 9,
  },
  {
    id: "madrasah-registration",
    title: "Madrasah registration",
    date: "2026-09-13",
    time: "10:00",
    masjidId: "habibia",
    kind: "Open to all",
    description:
      "Registration for the new madrasah year. Bring the child's birth certificate and last report. Teachers will be available to answer questions about class times and Qāʿidah placement.",
    whenNote: "10:00 – 13:00 · main hall",
    goingCount: 12,
    maybeCount: 2,
  },
  {
    id: "janazah-workshop",
    title: "Janāzah rites workshop",
    date: "2026-09-16",
    time: "18:30",
    masjidId: "masjidul-quds",
    kind: "Weekly",
    description:
      "A practical walk-through of the janāzah prayer, washing and shrouding, led by the masjid's imams. Spaces are limited to keep the hall workable — please RSVP so we can prepare materials.",
    whenNote: "After Maghrib jamaat · about 90 min",
    goingCount: 31,
    maybeCount: 4,
    myRsvp: "cant-go",
  },
];

type EventEdits = Record<string, Partial<Event>>;

function merge(extra: Event[], edits: EventEdits): Event[] {
  return [...EVENTS, ...extra].map((e) => ({ ...e, ...edits[e.id] }));
}

/** Public list: seed plus custom events with admin edits, cancelled ones hidden. */
export function listEvents(extra: Event[] = [], edits: EventEdits = {}): Event[] {
  return merge(extra, edits)
    .filter((e) => !e.cancelled)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

/** Admin list: every event for one masjid, cancelled included. */
export function listAdminEvents(
  masjidId: string,
  extra: Event[] = [],
  edits: EventEdits = {}
): Event[] {
  return merge(extra, edits)
    .filter((e) => e.masjidId === masjidId)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

export function getEvent(
  id: string,
  extra: Event[] = [],
  edits: EventEdits = {}
): Event | undefined {
  return merge(extra, edits).find((e) => e.id === id);
}
