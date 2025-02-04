import { AppBskyRichtextFacet } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
export type {
  Record as PostRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/post";

export type Facet = AppBskyRichtextFacet.Main;
export type Profile = ProfileViewDetailed;
