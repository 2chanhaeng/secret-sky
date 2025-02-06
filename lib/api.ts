import { Profile } from "@/types/bsky";
import { BSKY_GET_PROFILE_API } from "./const";

export const getProfile: (handle: string) => Promise<Profile> = (handle) =>
  fetch(`${BSKY_GET_PROFILE_API}?actor=${handle}`).then((res) => res.json());
