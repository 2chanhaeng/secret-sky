import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteAccount } from "@/hooks/use-logged-account";
import { useProfile } from "@/hooks/use-profile";
import { BaseProfile } from "@/types/profile";
import { XIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default function ChangeAccount({
  avatar,
  displayName,
  handle,
  did,
}: BaseProfile) {
  const { deleteProfile } = useProfile();
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
