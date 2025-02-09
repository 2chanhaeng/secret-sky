import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DBProvider, useAccountUpdate, useLoggedAccounts } from "@/hooks/db";
import { BaseProfile } from "@/types/profile";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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
    <Link
      key={did}
      href={`/auth?handle=${handle}`}
      className="flex justify-start items-center gap-2 py-2 px-4"
    >
      <Avatar className="size-8">
        <AvatarImage src={avatar} alt={handle} />
        <AvatarFallback>{handle}</AvatarFallback>
      </Avatar>
      <span className="font-bold text-base">{displayName || handle}</span>
      <span className="text-sm text-foreground/60">@{handle}</span>
    </Link>
  );
}
