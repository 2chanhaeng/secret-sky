import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/bsky";
import Link from "next/link";

interface AuthorAvatarProps extends Profile {
  className?: string;
}

export default function AuthorAvatar({
  did,
  handle,
  avatar,
  displayName,
  className,
}: AuthorAvatarProps) {
  const name = displayName ?? `@${handle}`;
  const src = avatar ?? "";
  return (
    <Link href={`https://bsky.app/profile/${did}`} className={className}>
      <Avatar>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
