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
export const BSKY_GET_POSTS_API =
  `${BSKY_PUBLIC_API}/xrpc/app.bsky.feed.getPosts`;
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
export const BSKY_CDN_URL = "https://cdn.bsky.app/img";
export const BSKY_CDN_IMAGE_PATH = `${BSKY_CDN_URL}/feed_fullsize/plain`;
export const BSKY_CDN_THUMB_PATH = `${BSKY_CDN_URL}/feed_thumbnail/plain`;
export const BSKY_VIDEO_CDN = "https://video.bsky.app";
export const BSKY_VIDEO_CDN_PATH = `${BSKY_VIDEO_CDN}/watch`;
export const EMBED_SECRET_TYPE = "dev.chomu.embed.secret";
export const EMBED_SECRET_ENCRYPTED_TYPE = `${EMBED_SECRET_TYPE}#encrypted`;
export const OFFICIAL_ACCOUNT_DID = process.env.OFFICIAL_ACCOUNT_DID as string;
