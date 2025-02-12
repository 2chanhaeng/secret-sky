import { pickProfile } from "@/lib/profile";
import { Profile } from "@/types/bsky";
import { BaseProfile } from "@/types/profile";
import { useEffect, useState } from "react";

const PROFILE_CACHE_KEY = "profile";
const PREF_API_PATH = "/api/profile";

export const useProfile = (): BaseProfile | null => {
  const [pref, setProfile] = useState<BaseProfile | null>(null);

  useEffect(() => {
    getProfile().then(pickProfile).then(setProfile) //
      .catch(() => setProfile(null));
  }, []);

  return pref;
};

export const deleteProfile = () => caches.delete(PROFILE_CACHE_KEY);
const getProfile = () => loadProfile().catch(() => refreshProfile());
export const refreshProfile = () => cacheProfile().then(() => loadProfile());
const loadProfile = () =>
  caches.open(PROFILE_CACHE_KEY).then((cache) => cache.match(PREF_API_PATH)) //
    .then((match) => match!.json() as unknown as Profile);
const cacheProfile = () =>
  caches.open(PROFILE_CACHE_KEY).then((cache) => cache.add(PREF_API_PATH));
