import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DBProvider,
  useAccountUpdate,
  useDeleteAccount,
  useLoggedAccounts,
} from "@/hooks/db";
import { BaseProfile } from "@/types/profile";
import { ChevronRight, XIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteProfile } from "@/hooks/use-profile";

export default function NavigationProfileList(profile: BaseProfile) {
  return (
    <DBProvider>
      <CurrentProfile {...profile} />
      <LoggedAccounts current={profile.did} />
    </DBProvider>
  );
}

function CurrentProfile(profile: BaseProfile) {
  const { avatar, handle, displayName } = profile;
  useAccountUpdate(profile);
  return (
    <Link
      href={`/profile/${handle}`}
      className="flex flex-col justify-center items-center gap-2 border rounded-md mt-2 py-4 px-2 mb-4"
    >
      <Avatar className="size-24">
        <AvatarImage src={avatar} alt={handle} />
        <AvatarFallback>{handle}</AvatarFallback>
      </Avatar>
      <span className="font-bold text-xl text-foreground">
        {displayName || handle}
      </span>
      <span className="text-base text-foreground/60">@{handle}</span>
      <span className="text-sm text-foreground/60 align-middle">
        <ChevronRight className="inline size-4" /> 프로필 보기
      </span>
    </Link>
  );
}

function LoggedAccounts({ current }: { current: string }) {
  const accounts = useLoggedAccounts(current);
  if (accounts.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 border rounded-md divide-x">
      {accounts.map((account) => (
        <ChangeAccount key={account.did} {...account} />
      ))}
    </div>
  );
}

function ChangeAccount({ avatar, displayName, handle, did }: BaseProfile) {
  return (
    <div className="py-2 px-4 flex justify-between items-center">
      <button
        key={did}
        onClick={() => {
          deleteProfile();
          redirect(`/auth?handle=${handle}`);
        }}
        className="flex justify-start items-center gap-2"
      >
        <Avatar className="size-8">
          <AvatarImage src={avatar} alt={handle} />
          <AvatarFallback>{handle}</AvatarFallback>
        </Avatar>
        <span className="font-bold text-base line-clamp-1">
          {displayName || handle}
        </span>
        <span className="text-sm text-foreground/60 line-clamp-1">
          @{handle}
        </span>
      </button>
      <button onClick={useDeleteAccount(did)}>
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
