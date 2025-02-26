import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { CALLBACK_URL, PUBLIC_URL, URL_BASE } from "./url";
import { sessions, states } from "./cookie";
import keyset from "./keyset";

const scopes = ["atproto", "transition:generic"];
const scope = scopes.join(" ");
const getLocalClientId = () =>
  [
    "http://localhost?redirect_uri=",
    encodeURIComponent(CALLBACK_URL),
    "&scope=",
    encodeURIComponent(scope),
  ].join("");
const client_id = PUBLIC_URL
  ? `${URL_BASE}/client-metadata.json`
  : getLocalClientId();

const client = new NodeOAuthClient({
  // This object will be used to build the payload of the /client-metadata.json
  // endpoint metadata, exposing the client metadata to the OAuth server.
  clientMetadata: {
    // Must be a URL that will be exposing this metadata
    client_id,
    scope,
    client_name: "Secret Sky",
    client_uri: URL_BASE,
    redirect_uris: [CALLBACK_URL],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    application_type: "web",
    token_endpoint_auth_signing_alg: "ES256",
    token_endpoint_auth_method: "private_key_jwt",
    dpop_bound_access_tokens: true,
    jwks_uri: `${URL_BASE}/jwks.json`,
  },

  keyset,

  // Interface to store authorization state data (during authorization flows)
  stateStore: {
    set: (key, state) => states.create({ key, state }),
    get: (key) =>
      states.get().then((cookie) =>
        cookie?.key === key ? cookie?.state : undefined
      ),
    del: () => states._delete(),
  },

  // Interface to store authenticated session data
  sessionStore: {
    set: (sub, session) => sessions.create({ sub, session }),
    get: (sub) =>
      sessions.get().then((cookie) =>
        cookie?.sub === sub ? cookie?.session : undefined
      ),
    del: () => sessions._delete(),
  },
});

export default client;
