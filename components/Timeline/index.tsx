import AuthorAvatar from "@/components/AuthorAvatar";
import { Content } from "@/types/content";
import { formatDate } from "@/lib/datetime";

export async function TimelineItem({
  content: { open, decrypted, author, createdAt },
}: {
  content: Content;
}) {
  const name = author.displayName ?? author.handle;
  return (
    <article className="p-4 w-full flex">
      <AuthorAvatar {...author} className="" />
      <div className="flex flex-col gap-2 flex-1">
        <p className="flex gap-2 text-sm">
          <span className="font-bold">{name}</span>
          <span className="text-foreground/60">@{author.handle}</span>
          <span className="text-foreground/60">·</span>
          <span className="text-foreground/60">{formatDate(createdAt)}</span>
        </p>
        <p className="text-gray-500 text-lg">{open}</p>
        <p className="text-2xl">{decrypted}</p>
      </div>
    </article>
  );
}
