import { ProfilePref } from "@/types/bsky";
import { useAccountCache } from "./use-account-cache";

const PREF_API_PATH = "/api/pref";

export const usePref = () => useAccountCache<ProfilePref>(PREF_API_PATH);
export const useFeeds = () => usePref()?.savedFeeds || [];
