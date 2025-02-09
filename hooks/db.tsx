import { BaseProfile } from "@/types/profile";
import {
  IndexedDB,
  IndexedDBProps,
  initDB,
  useIndexedDB,
} from "react-indexed-db-hook";
import { useEffect, useState } from "react";

export const SecretSkyDBVersion1Schema: IndexedDBProps = {
  name: "SecretSkyDB",
  version: 1,
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
  ],
} as const;

initDB(SecretSkyDBVersion1Schema);

export function DBProvider({ children }: { children: React.ReactNode }) {
  return <IndexedDB {...SecretSkyDBVersion1Schema}>{children}</IndexedDB>;
}

export const useAccountUpdate = (profile: BaseProfile) => {
  const db = useIndexedDB("accounts");
  useEffect(() => {
    db.getByID<BaseProfile>(profile.did).then((p) => {
      if (!p) db.add<BaseProfile>(profile);
      else db.update<BaseProfile>(profile);
    });
  }, [db, profile]);
};

export const useLoggedAccounts = (current: string) => {
  const db = useIndexedDB("accounts");
  const [accounts, setAccounts] = useState<BaseProfile[]>([]);
  useEffect(() => {
    db.getAll<BaseProfile>()
      .then((accounts) => accounts.filter((p) => p.did !== current))
      .then(setAccounts)
      .catch(console.error);
  }, [db, current]);
  return accounts;
};
