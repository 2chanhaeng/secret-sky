import {
  NodeOAuthClient,
  NodeSavedSession,
  NodeSavedState,
} from "@atproto/oauth-client-node";
import { JoseKey } from "@atproto/jwk-jose";
import { EncryptedCookie } from "./secure";

const client_id = `http://localhost?redirect_uri=${
  encodeURIComponent("http://127.0.0.1:3000/auth/callback/atproto")
}&scope=${encodeURIComponent("atproto transition:generic")}`;

const getJoseEcKey = async (
  key: string,
  kid: string = crypto.randomUUID(),
) => JoseKey.fromPKCS8(key.replace(/\\n/g, "\n") ?? "", "ES256", kid);

const keyset = await Promise.all(
  Array.from(
    { length: 3 },
    (_, i) => getJoseEcKey(process.env[`ECDSA_${i + 1}_PRIVATE_KEY`] ?? ""),
  ),
);

const sessions = new EncryptedCookie<{
  sub: string;
  session: NodeSavedSession;
}>("session");

const states = new EncryptedCookie<{
  key: string;
  state: NodeSavedState;
}>("auth_state");

const client = new NodeOAuthClient({
  // This object will be used to build the payload of the /client-metadata.json
  // endpoint metadata, exposing the client metadata to the OAuth server.
  clientMetadata: {
    // Must be a URL that will be exposing this metadata
    client_id,
    scope: "atproto transition:generic",
    client_name: "My App",
    client_uri: "http://127.0.0.1:3000",
    logo_uri: "http://127.0.0.1:3000/logo.png",
    tos_uri: "http://127.0.0.1:3000/tos",
    policy_uri: "http://127.0.0.1:3000/policy",
    redirect_uris: ["http://127.0.0.1:3000/auth/callback/atproto"],
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    application_type: "web",
    token_endpoint_auth_method: "private_key_jwt",
    token_endpoint_auth_signing_alg: "ES256",
    dpop_bound_access_tokens: true,
    jwks_uri: "http://127.0.0.1:3000/jwks.json",
  },

  // Used to authenticate the client to the token endpoint. Will be used to
  // build the jwks object to be exposed on the "jwks_uri" endpoint.
  keyset,

  // Interface to store authorization state data (during authorization flows)
  stateStore: {
    set: (key, state) => states.create({ key, state }),
    get: (key) =>
      states.get().then((cookie) =>
        cookie?.key === key ? cookie?.state : undefined
      ),
    del: () => states.delete(),
  },

  // Interface to store authenticated session data
  sessionStore: {
    set: (sub, session) => sessions.create({ sub, session }),
    get: (sub) =>
      sessions.get().then((cookie) =>
        cookie?.sub === sub ? cookie?.session : undefined
      ),
    del: () => sessions.delete(),
  },
});

export default client;
