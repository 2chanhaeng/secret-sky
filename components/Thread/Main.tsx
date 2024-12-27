import AuthorAvatar from "@/components/AuthorAvatar";
import { Content } from "@/types/content";
import Link from "next/link";

export default async function ThreadMain({
  content: { open, decrypted, author, createdAt },
}: {
  content: Content;
}) {
  const name = author.displayName ?? author.handle;
  return (
    <div className="p-4">
      <div className="grid grid-rows-2 gap-0.5">
        <AuthorAvatar {...author} className="row-span-2" />
        <p className="font-bold">{name}</p>
        <p className="text-foreground/60">@{author.handle}</p>
      </div>
      <p className="text-gray-500 text-lg">{open}</p>
      <p className="text-2xl">{decrypted}</p>
      <p className="text-gray-500 text-sm">{createdAt.toDateString()}</p>
    </div>
  );
}
