import { Facet } from "./bsky";
import { ENCRYPTED_FACET_TYPE } from "@/lib/const";

export interface EncryptedValue {
  $type: typeof ENCRYPTED_FACET_TYPE;
  encrypted: string;
}
export interface EncryptedFacet extends Facet {
  features: [{ $type: typeof ENCRYPTED_FACET_TYPE; encrypted: string }];
}
