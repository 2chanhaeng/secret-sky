"use client";

import { useLoggedAccounts } from "@/hooks/use-logged-account";
import ChangeAccount from "./ChangeAccount";
import { redirect } from "next/navigation";
import { FormEvent } from "react";
import { useProfile } from "@/hooks/use-profile";
import useRedirectTo from "@/hooks/use-redirect-to";

export default function LoggedAccounts({ current }: { current?: string }) {
  const accounts = useLoggedAccounts(current);
  const redirectTo = useRedirectTo();
  const { deleteProfile } = useProfile();

  if (accounts.length === 0) return null;
  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter;
        if (!submitter) return;
        const handle = (submitter as HTMLButtonElement).value;

        deleteProfile();
        redirect(`/auth?handle=${handle}&redirectTo=${redirectTo}`);
      }}
      className="flex flex-col gap-1 border rounded-md divide-y group"
    >
      {accounts.map((account) => (
        <ChangeAccount key={account.did} {...account} redirectTo={redirectTo} />
      ))}
    </form>
  );
}
