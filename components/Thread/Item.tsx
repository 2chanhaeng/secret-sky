import AuthorAvatar from "@/components/AuthorAvatar";
import { Content } from "@/types/content";
import Link from "next/link";

export default async function ThreadItem({
  content: { open, decrypted, author, createdAt, link },
}: {
  content: Content;
}) {
  const name = author.displayName ?? author.handle;
  return (
    <Link href={link}>
      <div className="p-4 flex">
        <AuthorAvatar {...author} className="row-span-2" />
        <div className="flex flex-col">
          <p>
            <span className="font-semibold">{name}</span>
            <span className="text-foreground/60">@{author.handle}</span>
          </p>
          <p className="text-gray-500 text-lg">{open}</p>
          <p className="text-2xl">{decrypted}</p>
          <p className="text-gray-500 text-sm">{createdAt.toDateString()}</p>
        </div>
      </div>
    </Link>
  );
}
