import { NodeSavedSession, NodeSavedState } from "@atproto/oauth-client-node";
import { EncryptJWT, importPKCS8, jwtDecrypt, JWTPayload } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.ECDH_PRIVATE_KEY;
if (!secretKey) throw new Error("ECDH_PRIVATE_KEY not found in environment");
const encodedKey = await importPKCS8(
  secretKey.replace(/\\n/g, "\n"),
  "ECDH-ES",
);

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
      try {
        const session = await encrypt(data);
        (await cookies()).set(key, session, {
          httpOnly: true,
          secure: true,
          expires: getExpiryFromNow(),
          sameSite: "lax",
        });
      } catch (e) {
        console.error(`Error creating cookie: ${key}`, e);
      }
    },

    async update() {
      try {
        const session = (await cookies()).get(key)?.value;
        const payload = await decrypt(session);

        if (!session || !payload) return;

        (await cookies()).set(key, session, {
          httpOnly: true,
          secure: true,
          expires: getExpiryFromNow(),
          sameSite: "lax",
        });
      } catch (e) {
        console.error(`Error updating cookie: ${key}`, e);
      }
    },

    async get(): Promise<Payload | undefined> {
      try {
        const cookie = (await cookies()).get(key);
        if (!cookie) return;
        const value = await decrypt(cookie?.value);
        return value as Payload | undefined;
      } catch (e) {
        console.error(`Error getting cookie: ${key}`, e);
      }
    },

    async _delete() {
      try {
        (await cookies()).delete(key);
      } catch (e) {
        console.error(`Error deleting cookie: ${key}`, e);
      }
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
