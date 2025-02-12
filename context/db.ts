import type { IndexedDBProps } from "react-indexed-db-hook";

const { IndexedDB, initDB, useIndexedDB } =
  await (typeof window !== "undefined"
    ? import("react-indexed-db-hook")
    : { IndexedDB: () => {}, initDB: () => {}, useIndexedDB: () => {} });

const SecretSkyDBSchema: IndexedDBProps = {
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
initDB(SecretSkyDBSchema);

export const DBProvider = ({ children }: { children: React.ReactNode }) =>
  IndexedDB({ ...SecretSkyDBSchema, children });

export const useFeedsTable = () => useIndexedDB("feeds");
export const useAccountsTable = () => useIndexedDB("accounts");
