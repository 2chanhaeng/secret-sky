export type { BskyPreferences as ProfilePref, Facet } from "@atproto/api";
export type { ProfileViewDetailed as Profile } from "@atproto/api/dist/client/types/app/bsky/actor/defs";
export type {
  GeneratorView as FeedView,
  PostView as PostViewType,
  ThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
export type {
  Record as GeneratorRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/generator";
export type {
  Record as ListRecord,
} from "@atproto/api/dist/client/types/app/bsky/graph/list";
export type {
  OutputSchema as GetRecordResponse,
} from "@atproto/api/dist/client/types/com/atproto/repo/getRecord";
export type {
  Record as PostRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/post";
export type {
  OutputSchema as GetPostThreadResponse,
} from "@atproto/api/dist/client/types/app/bsky/feed/getPostThread";
export type {
  Create as CreateRecord,
} from "@atproto/api/dist/client/types/com/atproto/repo/applyWrites";
export type {
  SavedFeed,
  ViewerState as Viewer,
} from "@atproto/api/dist/client/types/app/bsky/actor/defs";
export type {
  ListView,
} from "@atproto/api/dist/client/types/app/bsky/graph/defs";
