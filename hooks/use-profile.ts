import { pickProfile } from "@/lib/profile";
import { Profile } from "@/types/bsky";
import { BaseProfile } from "@/types/profile";
import { create } from "zustand";

const PROFILE_CACHE_KEY = "profile";
const PREF_API_PATH = "/api/profile";

export const useProfile = create<{
  profile: BaseProfile | null;
  fetched: boolean;
  pending: boolean;
  fetchProfile: () => void;
  deleteProfile: () => void;
}>((set) => ({
  profile: null,
  fetched: false,
  pending: false,
  fetchProfile: () =>
    Promise.resolve() //
      .then(() => set({ pending: true })) //
      .then(getProfile)
      .then((profile) => set({ profile })) //
      .catch(() => set({ profile: null }))
      .finally(() => set({ pending: false, fetched: true })),
  deleteProfile: () => deleteProfile().then(() => set({ profile: null })),
}));

const deleteProfile = () => caches.delete(PROFILE_CACHE_KEY);
const getProfile = () =>
  loadProfile().catch(() => refreshProfile()).then(pickProfile);
const refreshProfile = () => cacheProfile().then(() => loadProfile());
const loadProfile = () =>
  caches.open(PROFILE_CACHE_KEY).then((cache) => cache.match(PREF_API_PATH)) //
    .then((match) => match!.json() as unknown as Profile);
const cacheProfile = () =>
  caches.open(PROFILE_CACHE_KEY).then((cache) => cache.add(PREF_API_PATH));
