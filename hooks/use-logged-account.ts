import { useEffect, useState } from "react";
import { BaseProfile } from "@/types/profile";
import { useAccountsTable } from "@/context/db";

export const useAccountUpdate = (profile: BaseProfile) => {
  const db = useAccountsTable();
  useEffect(() => {
    db.getByID<BaseProfile>(profile.did).then((p) => {
      if (!p) db.add<BaseProfile>(profile);
      else db.update<BaseProfile>(profile);
    });
  }, [db, profile]);
};

export const useLoggedAccounts = (current: string) => {
  const db = useAccountsTable();
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
  const db = useAccountsTable();
  return () => db.deleteRecord(did);
};
