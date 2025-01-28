import Link from "next/link";
import AuthorAvatar from "@/components/AuthorAvatar";
import { Content } from "@/types/content";
import Menu from "./Menu";

export default async function ThreadMain({
  content: { open, decrypted, author, createdAt },
}: {
  content: Content;
}) {
  const name = author.displayName ?? author.handle;
  const date = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
  return (
    <article className="p-4 w-full flex flex-col">
      <Link
        href={`https://bsky.app/profile/${author.handle}`}
        className="flex gap-2"
      >
        <AuthorAvatar {...author} size={12} />
        <p className="flex flex-col">
          <span className="font-bold">{name}</span>
          <span className="text-foreground/60">@{author.handle}</span>
        </p>
      </Link>
      <p className="text-gray-500 text-lg">{open}</p>
      <p className="text-2xl">{decrypted}</p>
      <p className="text-foreground/60 text-xs">{date}</p>
      <Menu />
    </article>
  );
}
