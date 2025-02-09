import { GetPostThreadResponse, Profile } from "@/types/bsky";
import { BSKY_GET_POST_THREAD_API, BSKY_GET_PROFILE_API } from "./const";

const parse = (res: Response) => res.json();

export const getProfile: (handle: string) => Promise<Profile> = (handle) =>
  fetch(`${BSKY_GET_PROFILE_API}?actor=${handle}`).then(parse);
export const getPostThread: (uri: string) => Promise<GetPostThreadResponse> = //
  (uri) => fetch(`${BSKY_GET_POST_THREAD_API}?uri=${uri}`).then(parse);
