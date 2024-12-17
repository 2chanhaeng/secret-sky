import { appendFile } from "fs/promises";
import { exportPKCS8, exportSPKI } from "jose";

export const main = () => {
  genAndSaveEcdsaKeys();
  genAndSaveEcdhKeys();
};

// ECDSA keys
const genAndSaveEcdsaKeys = async (length: number = 3) =>
  (await Array.fromAsync({ length }, genEcdsaKey)) //
    .forEach((keys, i) => saveExportedKeyPair(`ECDSA_${i + 1}`)(keys));
const genEcdsaKey = () =>
  crypto.subtle.generateKey(ECDSA_KEY_GEN_PARAMS, true, ["sign", "verify"]);
const ECDSA_KEY_GEN_PARAMS = {
  name: "ECDSA",
  namedCurve: "P-256",
} satisfies EcKeyGenParams;

// ECDH keys
const genAndSaveEcdhKeys = async (): Promise<void> =>
  genEcdhKeys().then(saveExportedKeyPair("ECDH"));
const genEcdhKeys = (): Promise<CryptoKeyPair> =>
  crypto.subtle.generateKey(ECDH_KEY_GEN_PARAMS, true, [
    "deriveKey",
    "deriveBits",
  ]);
const ECDH_KEY_GEN_PARAMS = {
  name: "ECDH",
  namedCurve: "P-256",
} satisfies EcKeyGenParams;

const saveExportedKeyPair: //
  (name: string) => (key: CryptoKeyPair) => void =
    (name) => ({ privateKey, publicKey }) => {
      exportPrivKey(privateKey).then(saveKey(`${name}_PRIVATE_KEY`));
      exportPubKey(publicKey).then(saveKey(`${name}_PUBLIC_KEY`));
    };
const exportPrivKey = (key: CryptoKey): Promise<string> =>
  exportPKCS8(key).then(formatKey);
const exportPubKey = (key: CryptoKey): Promise<string> =>
  exportSPKI(key).then(formatKey);
const formatKey = (key: string) => key.trim().replace(/\n/g, "\\n");

const saveKey = (name: string) => (key: string) =>
  appendFile(`./.env.local`, `${name}='${key}'\n`);
