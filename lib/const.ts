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
