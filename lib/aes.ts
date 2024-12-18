import { b64ToBuf, bufToB64 } from "./base64";

const exportRawKey: (key: CryptoKey) => Promise<string> = (key) =>
  crypto.subtle.exportKey("raw", key).then(bufToB64);
const genAesKey: () => Promise<CryptoKey> = () =>
  crypto.subtle.generateKey(
    { name: "AES-GCM", length: 128 },
    true,
    ["encrypt", "decrypt"],
  );
export const genKey: () => Promise<string> = () =>
  genAesKey().then(exportRawKey);

export const importAesKeyB64: (key: string) => Promise<CryptoKey> = (key) =>
  crypto.subtle.importKey(
    "raw",
    b64ToBuf(key),
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  );

export async function encrypt(
  plain: string,
  raw: string,
): Promise<{ iv: string; encrypted: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 12바이트 IV 생성
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plain);
  const key = await importAesKeyB64(raw);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );

  return { iv: bufToB64(iv), encrypted: bufToB64(encrypted) };
}

export async function decrypt(
  cipher: string,
  raw: string,
  iv: string,
): Promise<string> {
  const key = await importAesKeyB64(raw);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBuf(iv) },
    key,
    b64ToBuf(cipher),
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
