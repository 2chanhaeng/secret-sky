import { Profile } from "@/types/bsky";
import { BaseProfile } from "@/types/profile";

export const pickProfile = (
  { did, handle, avatar = "", displayName }: Profile,
): BaseProfile => ({
  did,
  handle,
  avatar,
  displayName: displayName ?? handle,
});
