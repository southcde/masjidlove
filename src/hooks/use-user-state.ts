"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultUserState, type Rsvp, type UserState } from "@/types";

const STORAGE_KEY = "masjidlove.user";

const SYNC_EVENT = "masjidlove:user";

function read(): UserState {
  if (typeof window === "undefined") return defaultUserState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUserState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultUserState,
      ...parsed,
      settings: { ...defaultUserState.settings, ...parsed.settings },
      notifications: { ...defaultUserState.notifications, ...parsed.notifications },
    };
  } catch {
    return defaultUserState;
  }
}

/** Write to storage and tell every other useUserState instance on the page. */
function persist(next: UserState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode etc. — the app still works for the session.
  }
  window.dispatchEvent(new Event(SYNC_EVENT));
}

/**
 * App-wide user state until auth exists. Persisted to localStorage so a
 * refresh keeps what the user entered. Replaced by the session when
 * Supabase arrives. Migrates the old onboarding key if present.
 */
export function useUserState(): [
  UserState,
  (update: Partial<UserState>) => void,
  {
    setRsvp: (eventId: string, rsvp: Rsvp | null) => void;
    toggleSaved: (masjidId: string) => void;
    /** False until localStorage has been read on the client */
    hydrated: boolean;
  },
] {
  // Start from the default so the server and first client render agree;
  // the stored state is applied right after mount.
  const [state, setState] = useState<UserState>(defaultUserState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let next = read();
    if (next === defaultUserState) {
      const migrated = window.localStorage.getItem("masjidlove.onboarding");
      if (migrated) {
        try {
          next = {
            ...defaultUserState,
            ...JSON.parse(migrated),
            savedMasjidIds: [],
            rsvps: {},
            onboardingComplete: true,
          };
        } catch {}
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from storage
    setState(next);
    setHydrated(true);
  }, []);

  // Keep separate components (e.g. the theme applier) in step with changes.
  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener(SYNC_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<UserState>) => {
    persist({ ...read(), ...patch });
  }, []);

  const setRsvp = useCallback((eventId: string, rsvp: Rsvp | null) => {
    const prev = read();
    const rsvps = { ...prev.rsvps };
    if (rsvp === null) delete rsvps[eventId];
    else rsvps[eventId] = rsvp;
    persist({ ...prev, rsvps });
  }, []);

  const toggleSaved = useCallback((masjidId: string) => {
    const prev = read();
    persist({
      ...prev,
      savedMasjidIds: prev.savedMasjidIds.includes(masjidId)
        ? prev.savedMasjidIds.filter((id) => id !== masjidId)
        : [...prev.savedMasjidIds, masjidId],
    });
  }, []);

  return [state, update, { setRsvp, toggleSaved, hydrated }];
}
