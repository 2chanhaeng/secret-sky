import { appendFile } from "fs/promises";

export const main = () => {
  genAndSaveEcdsaKids();
};

// ECDSA keys
const genAndSaveEcdsaKids = async (length: number = 3) =>
  (await Array.fromAsync({ length }, () => crypto.randomUUID())) //
    .forEach((keys, i) => saveKid(`ECDSA_${i + 1}`)(keys));
const saveKid = (name: string) => (key: string) =>
  appendFile(`./.env.local`, `${name}_KID='${key}'\n`);
