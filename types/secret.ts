import { LexiconDoc } from "@atproto/lexicon/src/types";
import { Lexicons } from "@atproto/lexicon";

const id = "dev.chomu.embed.secret" as const;

export const schemaDict = {
  DevChomuEmbedSecretMain: {
    lexicon: 1,
    id,
    defs: {
      main: {
        type: "object",
        required: ["encrypted"],
        properties: {
          encrypted: {
            type: "ref",
            ref: `lex:${id}#encrypted`,
          },
        },
      },
      encrypted: {
        type: "object",
        required: ["value"],
        properties: {
          value: {
            type: "bytes",
            description: "The encrypted data.",
          },
        },
      },
      view: {
        type: "object",
        required: ["encrypted"],
        properties: {
          encrypted: {
            type: "ref",
            ref: `lex:${id}#viewEncrypted`,
          },
        },
      },
      viewEncrypted: {
        type: "object",
        required: ["value"],
        properties: {
          value: {
            type: "string",
            description: "The decrypted data.",
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>;
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[];
export const lexicons: Lexicons = new Lexicons(schemas);

export interface Main {
  $type?: "dev.chomu.embed.secret";
  encrypted: Encrypted;
}
export interface Encrypted {
  $type?: "dev.chomu.embed.secret#encrypted";
  value: string;
}
export interface View {
  $type?: "dev.chomu.embed.secret#view";
  encrypted: ViewEncrypted;
}
export interface ViewEncrypted {
  $type?: "dev.chomu.embed.secret#viewEncrypted";
  value: string;
}
