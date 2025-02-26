import { Facet, PostRecord } from "@/types/bsky";
import { isEncryptedEmbed, isEncryptedFacet } from "./pred";
import { EncryptedValue } from "@/types/facet";

export const extractEncrypted = (record: PostRecord): string => {
  const embed = extractEncryptedEmbed(record);
  if (embed) return embed;
  const facet = extractEncryptedFacet(record);
  if (facet) return facet.encrypted;
  return "";
};

const extractEncryptedEmbed = (
  record: PostRecord,
) => {
  const { embed } = record;
  if (!isEncryptedEmbed(embed)) return undefined;
  if (embed.encrypted) return embed.encrypted.value;
  return undefined;
};

const extractEncryptedFacet = (
  record: PostRecord,
): EncryptedValue | undefined =>
  Array.isArray(record.facets)
    ? record.facets
      .map((facet: Facet) => (facet.features || []))
      .flat()
      .find(isEncryptedFacet) as EncryptedValue | undefined
    : undefined;
