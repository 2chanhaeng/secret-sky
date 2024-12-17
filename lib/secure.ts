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

export const encrypt = <Payload extends JWTPayload>(
  payload: Payload,
): Promise<string> =>
  new EncryptJWT(payload)
    .setProtectedHeader({ alg: "ECDH-ES+A128KW", enc: "A256GCM" })
    .encrypt(encodedKey);

export const decrypt = <Payload>(
  session: string | undefined = "",
): Promise<Payload> =>
  jwtDecrypt(session, encodedKey).then(({ payload }) => payload as Payload);

export class EncryptedCookie<D extends JWTPayload> {
  constructor(public readonly key: string) {}

  async create(data: D) {
    const session = await encrypt(data);
    (await cookies()).set(this.key, session, {
      httpOnly: true,
      secure: true,
      expires: getExpiryFromNow(),
      sameSite: "lax",
    });
  }

  async update() {
    const session = (await cookies()).get(this.key)?.value;
    const payload = await decrypt(session);

    if (!session || !payload) return;

    (await cookies()).set(this.key, session, {
      httpOnly: true,
      secure: true,
      expires: getExpiryFromNow(),
      sameSite: "lax",
    });
  }

  async get(): Promise<D | undefined> {
    const cookie = (await cookies()).get(this.key);
    if (!cookie) return;
    const value = await decrypt(cookie?.value);
    return value as D | undefined;
  }

  async delete() {
    (await cookies()).delete(this.key);
  }
}
