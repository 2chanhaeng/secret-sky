import { NodeSavedSession, NodeSavedState } from "@atproto/oauth-client-node";
import { EncryptJWT, importJWK, jwtDecrypt, JWTPayload } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.ECDH_PRIVATE_KEY;
if (!secretKey) throw new Error("ECDH_PRIVATE_KEY not found in environment");
const encodedKey = await importJWK(JSON.parse(secretKey), "ECDH-ES");

const getExpiryFromNow = () =>
  new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000);

const encrypt = <Payload extends JWTPayload>(
  payload: Payload,
): Promise<string> =>
  new EncryptJWT(payload)
    .setProtectedHeader({ alg: "ECDH-ES+A128KW", enc: "A256GCM" })
    .encrypt(encodedKey);

const decrypt = <Payload>(
  session: string | undefined = "",
): Promise<Payload> =>
  jwtDecrypt(session, encodedKey).then(({ payload }) => payload as Payload);

const encryptedCookie = //
  <Payload extends JWTPayload>(key: string) => ({ //
    async create(data: Payload) {
      const session = await encrypt(data);
      (await cookies()).set(key, session, {
        httpOnly: true,
        secure: true,
        expires: getExpiryFromNow(),
        sameSite: "lax",
      });
    },

    async update() {
      const session = (await cookies()).get(key)?.value;
      const payload = await decrypt(session);

      if (!session || !payload) return;

      (await cookies()).set(key, session, {
        httpOnly: true,
        secure: true,
        expires: getExpiryFromNow(),
        sameSite: "lax",
      });
    },

    async get(): Promise<Payload | undefined> {
      const cookie = (await cookies()).get(key);
      if (!cookie) return;
      const value = await decrypt(cookie?.value);
      return value as Payload | undefined;
    },

    async _delete() {
      (await cookies()).delete(key);
    },
  });

export const sessions = encryptedCookie<{
  sub: string;
  session: NodeSavedSession;
}>("session");

export const states = encryptedCookie<{
  key: string;
  state: NodeSavedState;
}>("auth_state");
