import { type Agent, type Facet, RichText } from "@atproto/api";
import { ENCRYPTED_FACET_TYPE, LINK_FACET_TYPE, TEXT_TO_LINK } from "./const";
import { getByteLength } from "./utils";
import { uriToPath } from "./uri";
import { URL_BASE } from "./url";

export const detectFacets = (agent: Agent) => async (text: string) => {
  const rt = new RichText({ text });
  await rt.detectFacets(agent);
  return rt.facets ?? [];
};

export const createEncryptFacet: (props: { encrypted: string }) => Facet = ({
  encrypted,
}) => ({
  index: { byteStart: 0, byteEnd: 0 },
  features: [{ $type: ENCRYPTED_FACET_TYPE, encrypted }],
});

export const createDecryptLinkFacet: (
  props: { text: string; uri: string },
) => Facet = (
  { text, uri },
) => {
  const url = `${URL_BASE}${uriToPath(uri)}`;
  const byteStart = getByteLength(text.slice(0, -TEXT_TO_LINK.length));
  const byteEnd = getByteLength(text);
  return {
    index: { byteStart, byteEnd },
    features: [{ $type: LINK_FACET_TYPE, uri: url }],
  };
};
