import { JoseKey } from "@atproto/jwk-jose";
import { Key as AbstractKey } from "@atproto/oauth-client-node";

const KEYS_LENGTH = 3;

const generateKey = (_: unknown, i: number) =>
  JoseKey.fromJWK(
    JSON.parse(process.env[`ECDSA_${i + 1}_PRIVATE_KEY`]!),
    process.env[`ECDSA_${i + 1}_KID`]!,
  );

const keyset: AbstractKey[] = await Array.fromAsync(
  { length: KEYS_LENGTH },
  generateKey,
);

export default keyset;
