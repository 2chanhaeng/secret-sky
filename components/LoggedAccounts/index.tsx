"use client";

import { useLoggedAccounts } from "@/hooks/use-logged-account";
import ChangeAccount from "./ChangeAccount";
import { usePathname } from "next/navigation";

export default function LoggedAccounts({ current }: { current?: string }) {
  const redirectTo = usePathname();
  const accounts = useLoggedAccounts(current);
  if (accounts.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 border rounded-md divide-y">
      {accounts.map((account) => (
        <ChangeAccount key={account.did} {...account} redirectTo={redirectTo} />
      ))}
    </div>
  );
}
