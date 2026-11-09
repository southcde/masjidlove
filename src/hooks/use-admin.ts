"use client";

import { useUserState } from "@/hooks/use-user-state";
import { adminMasjidIdOf, getMasjid } from "@/services/masjids";

/** Current user state plus the masjid they administer. */
export function useAdmin() {
  const [state, update, actions] = useUserState();
  const masjidId = adminMasjidIdOf(state.followedMasjidIds);
  const masjid = getMasjid(masjidId);
  return { state, update, actions, masjidId, masjid };
}
