import { Facet } from "@/types/bsky";
import { isEncryptedFacet } from "./pred";
import { decrypt } from "./aes";
import { EncryptedFacet } from "@/types/facet";

export const decryptFacet: (
  facet: Facet | undefined,
  key: string,
  iv: string,
) => Promise<string> = async (facet, key, iv) =>
  facet && isEncryptedFacet(facet)
    ? decrypt(facet.encrypted, key, iv)
    : Promise.resolve("");

export const getEncryptedFacet = (
  facets: Facet[],
): EncryptedFacet | undefined =>
  facets
    .map((facet) => (facet.features || []))
    .flat()
    .find(isEncryptedFacet) as EncryptedFacet | undefined;
