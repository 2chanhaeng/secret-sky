import { AppBskyRichtextFacet } from "@atproto/api";
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
export type {
  Record as PostRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/post";
export type {
  Create as CreateRecord,
} from "@atproto/api/dist/client/types/com/atproto/repo/applyWrites";

export type Facet = AppBskyRichtextFacet.Main;
export type Profile = ProfileViewDetailed;
