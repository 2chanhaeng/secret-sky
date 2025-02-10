import { useEffect, useState } from "react";
import { BaseProfile } from "@/types/profile";
import { useIndexedDB } from "react-indexed-db-hook";

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

export const useDeleteAccount = (did: string) => {
  const db = useIndexedDB("accounts");
  return () => db.deleteRecord(did);
};
