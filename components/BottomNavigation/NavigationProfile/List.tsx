import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DBProvider } from "@/context/db";
import { BaseProfile } from "@/types/profile";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAccountUpdate } from "@/hooks/use-logged-account";
import LoggedAccounts from "@/components/LoggedAccounts";

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
