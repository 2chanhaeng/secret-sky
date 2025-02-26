import {
  JwtHeader,
  JwtPayload,
  Key as AbstractKey,
  Keyset,
  RequiredKey,
  SignedJwt,
  VerifyOptions,
  VerifyResult,
} from "@atproto/jwk";
import { b64ToBuf } from "./base64";

type KeyType = "EC";
type Usage = "sig";
const CURVE = "P-256";

interface PrivateKey {
  kty: KeyType;
  x: string;
  y: string;
  crv: typeof CURVE;
  d: string;
  kid: string;
  use: Usage;
}

const kids = Array.from(
  { length: 3 },
  (_, i) => process.env[`ECDSA_${i + 1}_KID`!]!,
);
const getPrivateKey = (i: number) =>
  JSON.parse(process.env[`ECDSA_${i + 1}_PRIVATE_KEY`]!);
const privateKeys: PrivateKey[] = kids.map((kid, i) => ({
  kid,
  ...getPrivateKey(i),
}));

// const jwks = await Promise.all(Array.from({ length: 3 }, () => createJwk()))

class Key extends AbstractKey {
  constructor(public jwk: PrivateKey) {
    super(jwk);
  }
  async getPublicKey(): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      "jwk",
      { ...this.jwk, ext: true },
      { name: "ECDSA", namedCurve: CURVE },
      true,
      ["verify"],
    );
  }

  async getPrivateKey(): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      "jwk",
      { ...this.jwk, ext: true },
      { name: "ECDSA", namedCurve: CURVE },
      true,
      ["sign"],
    );
  }

  async createJwt(header: JwtHeader, payload: JwtPayload): Promise<SignedJwt> {
    const jwt = await this.sign(header, payload);
    return jwt;
  }

  async verifyJwt<C extends string = never>(
    token: SignedJwt,
    options?: VerifyOptions<C>,
  ): Promise<VerifyResult<C>> {
    const result = await this.verify(token, options);
    return result;
  }

  async sign(header: JwtHeader, payload: JwtPayload): Promise<SignedJwt> {
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64url",
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url",
    );
    const data = `${encodedHeader}.${encodedPayload}`;

    const buffer = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      await this.getPrivateKey(),
      Buffer.from(data),
    );

    const signature = Buffer.from(buffer).toString("base64url");
    return `${data}.${signature}` as SignedJwt;
  }

  async verify<C extends string = never>(
    token: SignedJwt,
    options?: VerifyOptions<C>,
  ): Promise<VerifyResult<C>> {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token");
    }
    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    const publicKey = await this.getPublicKey();
    const isValid = await crypto.subtle.verify(
      { name: "ECDSA", hash: "SHA-256" },
      publicKey,
      b64ToBuf(signature),
      b64ToBuf(data),
    );
    if (!isValid) {
      throw new Error("Invalid signature");
    }
    const protectedHeader = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString(),
    );
    const payload: RequiredKey<JwtPayload, C> = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString(),
    );

    if (options) {
      const now = options.currentDate ?? new Date();

      if (options.issuer) {
        if (Array.isArray(options.issuer)) {
          if (!options.issuer.includes(payload.iss)) {
            throw new Error(
              `Issuer mismatch: expected one of ${
                options.issuer.join(", ")
              }, got ${payload.iss}`,
            );
          }
        } else {
          if (payload.iss !== options.issuer) {
            throw new Error(
              `Issuer mismatch: expected ${options.issuer}, got ${payload.iss}`,
            );
          }
        }
      }

      if (options.audience) {
        if (Array.isArray(options.audience)) {
          if (Array.isArray(payload.aud)) {
            if (!payload.aud.some((a) => options.audience!.includes(a))) {
              throw new Error(
                `Audience mismatch: expected one of ${
                  options.audience.join(", ")
                }, got ${payload.aud}`,
              );
            }
          } else if (!options.audience.includes(payload.aud as string)) {
            throw new Error(
              `Audience mismatch: expected one of ${
                options.audience.join(", ")
              }, got ${payload.aud}`,
            );
          }
        } else {
          if (Array.isArray(payload.aud)) {
            if (!payload.aud.includes(options.audience as string)) {
              throw new Error(
                `Audience mismatch: expected ${options.audience}, got ${
                  payload.aud.join(", ")
                }`,
              );
            }
          } else if (payload.aud !== options.audience) {
            throw new Error(
              `Audience mismatch: expected ${options.audience}, got ${payload.aud}`,
            );
          }
        }
      }

      if (options.subject && payload.sub !== options.subject) {
        throw new Error(
          `Subject mismatch: expected ${options.subject}, got ${payload.sub}`,
        );
      }

      if (options.typ && protectedHeader.typ !== options.typ) {
        throw new Error(
          `Type mismatch: expected ${options.typ}, got ${protectedHeader.typ}`,
        );
      }

      if (options.maxTokenAge !== undefined) {
        if (typeof payload.iat !== "number") {
          throw new Error(
            'Token missing "iat" claim for maxTokenAge validation',
          );
        }
        const tokenAge = Math.floor(now.getTime() / 1000) - payload.iat;
        const tolerance = options.clockTolerance ?? 0;
        if (tokenAge - tolerance > options.maxTokenAge) {
          throw new Error(
            `Token age ${tokenAge} exceeds maximum allowed age of ${options.maxTokenAge} seconds`,
          );
        }
      }

      if (options.requiredClaims) {
        for (const claim of options.requiredClaims) {
          if (!(claim in payload)) {
            throw new Error(`Missing required claim: ${claim}`);
          }
        }
      }
    }

    return { protectedHeader, payload };
  }
}

const keyset: Keyset = new Keyset(privateKeys.map((jwk) => new Key(jwk)));

export default keyset;
