import { IndexedDB, IndexedDBProps, initDB } from "react-indexed-db-hook";

const SecretSkyDBVersion1Schema: IndexedDBProps = {
  name: "SecretSkyDB",
  version: 2,
  objectStoresMeta: [
    {
      store: "accounts",
      storeConfig: { keyPath: "did", autoIncrement: false },
      storeSchema: [
        { name: "did", keypath: "did", options: { unique: true } },
        { name: "handle", keypath: "handle", options: { unique: true } },
        { name: "avatar", keypath: "avatar", options: { unique: false } },
        {
          name: "displayName",
          keypath: "displayName",
          options: { unique: false },
        },
      ],
    },
    {
      store: "feeds",
      storeConfig: { keyPath: "uri", autoIncrement: false },
      storeSchema: [
        { name: "type", keypath: "type", options: { unique: false } },
        { name: "uri", keypath: "uri", options: { unique: true } },
        {
          name: "displayName",
          keypath: "displayName",
          options: { unique: false },
        },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        { name: "avatar", keypath: "avatar", options: { unique: false } },
      ],
    },
  ],
} as const;

initDB(SecretSkyDBVersion1Schema);

export const DBProvider = ({ children }: { children: React.ReactNode }) =>
  IndexedDB({ ...SecretSkyDBVersion1Schema, children });
