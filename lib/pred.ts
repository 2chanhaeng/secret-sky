import { EncryptedValue } from "@/types/facet";
import { ENCRYPTED_FACET_TYPE } from "./const";
import { Facet } from "@atproto/api";
export {
  isRecord as isPostRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/post";
export {
  isReasonRepost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
export {
  isRecord as isGeneratorRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/generator";
export {
  isRecord as isListRecord,
} from "@atproto/api/dist/client/types/app/bsky/graph/list";
export { isPostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
export { isThreadViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
export {
  isMain as isImageEmbed,
  isView as isImageView,
} from "@atproto/api/dist/client/types/app/bsky/embed/images";
export {
  isMain as isVideoEmbed,
  isView as isVideoView,
} from "@atproto/api/dist/client/types/app/bsky/embed/video";
export {
  isMain as isExternalEmbed,
  isView as isExternalView,
} from "@atproto/api/dist/client/types/app/bsky/embed/external";
export {
  isMain as isRecordEmbed,
  isView as isRecordView,
  isViewRecord,
} from "@atproto/api/dist/client/types/app/bsky/embed/record";
export {
  isMain as isRecordWithMediaEmbed,
  isView as isRecordWithMediaView,
} from "@atproto/api/dist/client/types/app/bsky/embed/recordWithMedia";
export {
  isMain as isStrongRef,
} from "@atproto/api/dist/client/types/com/atproto/repo/strongRef";
export const isObj = (v: unknown): v is object =>
  typeof v === "object" && v !== null;
export const hasProp = <K extends PropertyKey>(
  v: object,
  k: K,
): v is Record<K, unknown> => k in v;

export const isEncryptedFacet = (v: unknown): v is EncryptedValue => (
  isObj(v) &&
  hasProp(v, "$type") &&
  (v.$type === ENCRYPTED_FACET_TYPE)
);
export const hasEncryptedFacet = (v: Facet[] | undefined): boolean =>
  v ? v.map(({ features }) => features).flat().some(isEncryptedFacet) : false;
