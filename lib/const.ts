export const APPLY_WRITE_TYPE = "com.atproto.repo.applyWrites#create";
export const POST_TYPE = "app.bsky.feed.post";
export const THREADGATE_TYPE = "app.bsky.feed.threadgate";
export const POSTGATE_TYPE = "app.bsky.feed.postgate";
export const TEXT_TO_LINK = "비밀글 보기";
export const FACET_TYPE = "app.bsky.richtext.facet";
export const ENCRYPTED_FACET_TYPE = `${FACET_TYPE}#encrypt`;
export const LINK_FACET_TYPE = `${FACET_TYPE}#link`;
export const POSTGATE_DISABLE_TYPE = `${POSTGATE_TYPE}#disableRule`;
export const POSTGATE_DISABLE_RULE = { $type: POSTGATE_DISABLE_TYPE };
export const BSKY_PUBLIC_API = "https://public.api.bsky.app";
export const BSKY_GET_PROFILE_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.actor.getProfile`;
export const BSKY_GET_POST_THREAD_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.getPostThread`;
export const BSKY_GET_RECORD_API =
  `${BSKY_PUBLIC_API}/xrpc/com.atproto.repo.getRecord`;
export const BSKY_GET_FEED_GENERATORS_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.getFeedGenerators`;
export const BSKY_GET_LISTS_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.graph.getLists`;
export const BSKY_GET_FEED_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.getFeed`;
export const BSKY_GET_LIST_FEED_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.graph.getListFeed`;
export const SELF_LABEL = "com.atproto.label.defs#selfLabels";
export const NO_AUTH_LABEL = "!no-unauthenticated";
export const DEFAULT_TIMELINE_FEED = {
  uri: "following",
  type: "timeline",
  displayName: "Following",
  description: "Following",
  avatar: "",
  pinned: true,
} as const;
