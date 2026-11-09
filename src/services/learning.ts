import type { ClassSession, Course, Lesson } from "@/types";

// Mock data until Supabase exists (SETUP.md §10). Teachers and course
// content are placeholders, not real people or real curricula.

const COURSES: Course[] = [
  {
    id: "foundations-of-salah",
    title: "Foundations of Salah",
    teacher: "Ustadha Aaisha Davids",
    level: "Beginner",
    category: "Worship",
    summary:
      "Learn each part of the prayer step by step — what to say, what to do, and why. Built for new Muslims and anyone who wants to pray with more confidence.",
    lessons: [
      {
        id: "salah-1",
        title: "Wudhu, step by step",
        minutes: 8,
        kind: "video",
        body: "Wudhu is the purification before prayer. Wash your hands, rinse your mouth and nose, wash your face, forearms, wipe your head and ears, then wash your feet — each in order. This lesson walks through the sequence slowly, with the common mistakes to avoid.",
      },
      {
        id: "salah-2",
        title: "Facing the qiblah and your intention",
        minutes: 6,
        kind: "reading",
        body: "Before you begin, you face the qiblah and form the intention in your heart. The intention is not spoken aloud — it is the quiet decision to pray this prayer for Allah. We cover how to find the qiblah anywhere, and what to do if you are unsure.",
      },
      {
        id: "salah-3",
        title: "Standing, rukūʿ and sujūd",
        minutes: 12,
        kind: "video",
        body: "The movements of the prayer, in order: standing, bowing, rising, prostrating, sitting, prostrating again. Watch the full cycle of one rakʿah, then each posture on its own with attention to where your hands, feet and gaze rest.",
      },
      {
        id: "salah-4",
        title: "What you recite",
        minutes: 10,
        kind: "reading",
        body: "Sūrat al-Fātiḥah, a short sūrah, the tasbīḥ in rukūʿ and sujūd, and the tashahhud. Each recitation is given with transliteration and meaning, so you understand what you are saying as you say it.",
      },
      {
        id: "salah-5",
        title: "Check your understanding",
        minutes: 4,
        kind: "quiz",
        body: "A short check on the order of the prayer.",
        quiz: {
          question: "What comes immediately after rukūʿ (bowing)?",
          options: [
            "Going straight into sujūd",
            "Rising to stand upright",
            "Sitting for the tashahhud",
          ],
          answer: 1,
        },
      },
      {
        id: "salah-6",
        title: "Completing the prayer",
        minutes: 7,
        kind: "reading",
        body: "The final sitting, the salawāt, and the salām to the right and left. We close with common questions: what if I forget a part, how do I make up a missed prayer, and how do I pray when travelling.",
      },
    ],
  },
  {
    id: "tajweed-essentials",
    title: "Tajwīd essentials",
    teacher: "Qari Yusuf Hendricks",
    level: "Beginner",
    category: "Qurʾān",
    summary:
      "The rules that make recitation correct and beautiful: where each letter comes from, and how to handle the most common cases.",
    lessons: [
      {
        id: "tajweed-1",
        title: "Makhārij: where letters come from",
        minutes: 14,
        kind: "video",
        body: "Every Arabic letter has a point of articulation. We map the throat, tongue, lips and nasal passage, and practise the letters that are most often confused.",
      },
      {
        id: "tajweed-2",
        title: "Heavy and light letters",
        minutes: 9,
        kind: "reading",
        body: "Some letters are pronounced with a full, heavy mouth and others with a light one. Learn the seven heavy letters and how a neighbouring vowel changes the sound.",
      },
      {
        id: "tajweed-3",
        title: "Noon sākinah and tanwīn",
        minutes: 15,
        kind: "video",
        body: "Four rules govern the silent noon and tanwīn: iẓhār, idghām, iqlāb and ikhfāʾ. We learn each with examples from the last juzʾ.",
      },
      {
        id: "tajweed-4",
        title: "Check your understanding",
        minutes: 4,
        kind: "quiz",
        body: "A short check on the noon sākinah rules.",
        quiz: {
          question: "How many rules govern noon sākinah and tanwīn?",
          options: ["Two", "Four", "Six"],
          answer: 1,
        },
      },
      {
        id: "tajweed-5",
        title: "Practice: Sūrat an-Nās",
        minutes: 10,
        kind: "reading",
        body: "Apply everything so far to one short sūrah, line by line, with a recitation to follow and a checklist to review your own.",
      },
    ],
  },
  {
    id: "seerah-makkan-years",
    title: "Seerah: the Makkan years",
    teacher: "Shaykh Imran Petersen",
    level: "Intermediate",
    category: "History",
    summary:
      "The first thirteen years of the Prophet’s ﷺ mission — revelation, patience under persecution and the first community — told as a connected story.",
    lessons: [
      {
        id: "seerah-1",
        title: "Arabia before revelation",
        minutes: 16,
        kind: "video",
        body: "The social, religious and economic world of Makkah before the first revelation, and the character of the Prophet ﷺ in those years.",
      },
      {
        id: "seerah-2",
        title: "The first revelation",
        minutes: 12,
        kind: "reading",
        body: "The night in Hirāʾ, Khadījah’s response, and the first believers. What the opening words of revelation ask of us.",
      },
      {
        id: "seerah-3",
        title: "Open call and opposition",
        minutes: 15,
        kind: "video",
        body: "From private to public da‘wah, the boycott of Banū Hāshim, and how the early Muslims held together under pressure.",
      },
      {
        id: "seerah-4",
        title: "The year of sorrow",
        minutes: 10,
        kind: "reading",
        body: "The loss of Khadījah and Abū Ṭālib, the journey to Ṭāʾif, and the gift of al-Isrāʾ wal-Miʿrāj.",
      },
      {
        id: "seerah-5",
        title: "Check your understanding",
        minutes: 4,
        kind: "quiz",
        body: "A short check on the Makkan period.",
        quiz: {
          question: "Where did the first revelation come to the Prophet ﷺ?",
          options: ["Cave of Hirāʾ", "Cave of Thawr", "The Kaʿbah"],
          answer: 0,
        },
      },
      {
        id: "seerah-6",
        title: "Road to Madinah",
        minutes: 13,
        kind: "video",
        body: "The pledges at ʿAqabah and the preparations for the Hijrah. What changed, and what stayed the same, when the community moved.",
      },
    ],
  },
  {
    id: "arabic-for-the-quran",
    title: "Arabic for the Qurʾān",
    teacher: "Ustadh Imraan Salie",
    level: "Intermediate",
    category: "Language",
    summary:
      "Build a working vocabulary of the most frequent words in the Qurʾān, and learn enough grammar to follow what you read.",
    lessons: [
      {
        id: "arabic-1",
        title: "The hundred most frequent words",
        minutes: 12,
        kind: "reading",
        body: "A small set of words makes up a large share of the Qurʾān. We learn them in context with short āyāt, so they stick.",
      },
      {
        id: "arabic-2",
        title: "Nouns, verbs and particles",
        minutes: 14,
        kind: "video",
        body: "The three parts of speech in Arabic and how to tell them apart in a sentence you have never seen.",
      },
      {
        id: "arabic-3",
        title: "Reading a verse word by word",
        minutes: 11,
        kind: "reading",
        body: "Take one āyah, break it into words, find the root of each, and rebuild the meaning yourself.",
      },
      {
        id: "arabic-4",
        title: "Check your understanding",
        minutes: 4,
        kind: "quiz",
        body: "A short check on parts of speech.",
        quiz: {
          question: "Which of these is a particle (ḥarf)?",
          options: ["كِتَاب", "فِي", "كَتَبَ"],
          answer: 1,
        },
      },
      {
        id: "arabic-5",
        title: "Roots and patterns",
        minutes: 13,
        kind: "video",
        body: "Most Arabic words come from a three-letter root. See how one root opens up a whole family of related words.",
      },
    ],
  },
];

const CLASSES: ClassSession[] = [
  {
    id: "tajweed-circle",
    title: "Tajwīd circle — beginners",
    teacher: "Qari Yusuf Hendricks",
    masjidId: "masjidul-quds",
    date: "2026-09-08",
    time: "19:30",
    durationMinutes: 75,
    capacity: 20,
    takenSeats: 14,
    price: "Free",
    audience: "Brothers, ages 14 and up",
    description:
      "A small, hands-on circle. Each student recites and gets individual correction. Suitable if you can read Arabic slowly but have never studied tajwīd.",
    bring: "Your own muṣḥaf",
  },
  {
    id: "fiqh-purification",
    title: "Fiqh of purification — sisters",
    teacher: "Ustadha Aaisha Davids",
    masjidId: "habibia",
    date: "2026-09-10",
    time: "10:00",
    durationMinutes: 90,
    capacity: 30,
    takenSeats: 22,
    price: "R60",
    audience: "Sisters",
    description:
      "A practical morning on wudhu, ghusl and the rulings women ask about most. Questions are welcome and handled with discretion. Tea provided.",
  },
  {
    id: "arabic-clinic",
    title: "Arabic conversation clinic",
    teacher: "Ustadh Imraan Salie",
    masjidId: "masjidus-sunni",
    date: "2026-09-12",
    time: "14:00",
    durationMinutes: 60,
    capacity: 12,
    takenSeats: 12,
    price: "R40",
    audience: "Everyone, intermediate level",
    description:
      "Practise speaking in small groups, with the teacher moving between tables. Focus is on the vocabulary you meet in salah and Qurʾān.",
  },
  {
    id: "youth-hifz",
    title: "Youth ḥifẓ workshop",
    teacher: "Qari Ismail Daniels",
    masjidId: "masjidul-quds",
    date: "2026-09-14",
    time: "16:00",
    durationMinutes: 120,
    capacity: 25,
    takenSeats: 9,
    price: "Free",
    audience: "Ages 10–17",
    description:
      "Memorisation techniques that work: how to plan revision, how to build a routine around school, and how to keep what you have learned.",
    bring: "Notebook and pen",
  },
  {
    id: "new-muslim-evening",
    title: "New Muslim support evening",
    teacher: "Shaykh Imran Petersen",
    masjidId: "habibia",
    date: "2026-09-16",
    time: "19:00",
    durationMinutes: 90,
    capacity: 40,
    takenSeats: 11,
    price: "Free",
    audience: "New Muslims and anyone supporting one",
    description:
      "A relaxed evening with food, short talks and time to ask anything. You will leave with a named contact at the masjid.",
  },
];

export function listCourses(): Course[] {
  return COURSES;
}

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getLesson(
  courseId: string,
  lessonId: string
): { course: Course; lesson: Lesson; index: number } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  const index = course.lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) return undefined;
  return { course, lesson: course.lessons[index], index };
}

export function courseProgress(course: Course, completed: string[]) {
  const done = course.lessons.filter((l) => completed.includes(l.id)).length;
  return {
    done,
    total: course.lessons.length,
    percent: Math.round((done / course.lessons.length) * 100),
    minutesLeft: course.lessons
      .filter((l) => !completed.includes(l.id))
      .reduce((sum, l) => sum + l.minutes, 0),
  };
}

/** First lesson the user hasn't finished, or the first one if all are done. */
export function nextLesson(course: Course, completed: string[]): Lesson {
  return (
    course.lessons.find((l) => !completed.includes(l.id)) ?? course.lessons[0]
  );
}

export function listClasses(): ClassSession[] {
  return [...CLASSES].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
  );
}

export function getClass(id: string): ClassSession | undefined {
  return CLASSES.find((c) => c.id === id);
}

/** Seats left for other people, given how many the current user holds. */
export function seatsLeft(session: ClassSession, mySeats = 0): number {
  return Math.max(0, session.capacity - session.takenSeats - mySeats);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Tue 8 Sep · 19:30" */
export function classWhen(session: ClassSession): string {
  const d = new Date(`${session.date}T00:00:00`);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${session.time}`;
}
