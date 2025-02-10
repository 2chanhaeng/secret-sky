import { EncryptedValue } from "@/types/facet";
import { ENCRYPTED_FACET_TYPE } from "./const";
export {
  isRecord as isPostRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/post";
export {
  isRecord as isGeneratorRecord,
} from "@atproto/api/dist/client/types/app/bsky/feed/generator";
export {
  isRecord as isListRecord,
} from "@atproto/api/dist/client/types/app/bsky/graph/list";

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
