import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/bsky";
import Link from "next/link";

// interface AuthorInfoProps extends Profile {}

export default function AuthorInfo({
  did,
  handle,
  avatar,
  displayName,
}: Profile) {
  const name = displayName || handle;
  const src = avatar ?? "";
  return (
    <Link href={`/profile/${did}`} className="font-semibold">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={src} alt={name} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div>
          <p className="">{name}</p>
          <p className="text-sm text-gray-500">@{handle}</p>
        </div>
      </div>
    </Link>
  );
}
