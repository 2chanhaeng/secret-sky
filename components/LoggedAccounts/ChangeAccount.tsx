"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteAccount } from "@/hooks/use-logged-account";
import { BaseProfile } from "@/types/profile";
import { XIcon } from "lucide-react";

export default function ChangeAccount({
  avatar,
  displayName,
  handle,
  did,
}: BaseProfile & { redirectTo?: string }) {
  return (
    <div className="py-2 px-4 flex justify-between items-center">
      <button
        key={did}
        name="handle"
        value={handle}
        type="submit"
        className="flex justify-start items-center gap-2 w-full"
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
