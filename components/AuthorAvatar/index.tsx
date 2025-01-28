import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/bsky";
import Link from "next/link";

export interface AuthorAvatarProps extends Profile {
  className?: string;
  size?: number;
}

export default function AuthorAvatar({
  did,
  handle,
  avatar,
  displayName,
  className,
  size = 10,
}: AuthorAvatarProps) {
  const name = displayName ?? `@${handle}`;
  const src = avatar ?? "";
  return (
    <Link href={`https://bsky.app/profile/${did}`} className={className}>
      <Avatar className={`size-${size}`}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
    </Link>
  );
}
