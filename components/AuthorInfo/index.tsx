import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/bsky";
import Link from "next/link";

const variants = ["main", "sub", "quoted"] as const;
type Parts = "container" | "name" | "handle" | "avatar";
const defaultStyles = {
  name: "font-semibold",
  handle: "text-sm text-gray-500",
} as const;
const mainStyles = {
  container: "grid grid-cols-[auto_1fr] justify-start space-x-2",
  avatar: "row-span-2",
} as const;
const subStyles = {
  container: "flex items-center gap-2",
  avatar: "hidden",
} as const;
const quotedStyles = {
  container: "flex items-center space-x-2",
  avatar: "size-5",
} as const;
const authorInfoStyles: Record<
  "default" | (typeof variants)[number],
  Partial<Record<Parts, string | undefined>>
> = {
  default: defaultStyles,
  [variants[0]]: mainStyles,
  [variants[1]]: subStyles,
  [variants[2]]: quotedStyles,
} as const;

// interface AuthorInfoProps extends Profile {}

export default function AuthorInfo({
  did,
  handle,
  avatar,
  displayName,
  variant = variants[0],
}: Profile & { variant?: (typeof variants)[number] }) {
  const name = displayName || handle;
  const src = avatar ?? "";
  const {
    container: containerClass,
    avatar: avatarClass,
    name: nameClass,
    handle: handleClass,
  } = authorInfoStyles[variant];
  return (
    <Link href={`/profile/${did}`}>
      <div className={cn(authorInfoStyles.default.container, containerClass)}>
        <Avatar className={cn(authorInfoStyles.default.avatar, avatarClass)}>
          <AvatarImage src={src} alt={name} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <p className={cn(authorInfoStyles.default.name, nameClass)}>{name}</p>
        <p className={cn(authorInfoStyles.default.handle, handleClass)}>
          @{handle}
        </p>
      </div>
    </Link>
  );
}
