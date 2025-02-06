import { isPostRecord } from "@/lib/pred";
import AuthorInfo from "../AuthorInfo";
import DecryptView from "./DecryptView";
import Mention from "./Mention";
import { PostViewType } from "@/types/bsky";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { uriToPath } from "@/lib/uri";
import { ExternalLink } from "lucide-react";

export function MainPostView({
  uri,
  author,
  record,
  replyCount,
  viewer,
}: PostViewType) {
  if (!isPostRecord(record)) return null;
  const { text: raw, facets = [], createdAt } = record;
  const date = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <article>
      <AuthorInfo {...author} />
      <section>
        <p className="text-lg">{text}</p>
        <DecryptView facets={facets} viewer={viewer} uri={uri} />
      </section>
      <p className="text-foreground/60 text-xs pb-1 flex gap-2">
        {date}
        <LinkToBskyApp uri={uri} />
      </p>
      <section>
        <Mention count={replyCount ?? 0} uri={uri} />
      </section>
    </article>
  );
}

export function SubPostView({
  uri,
  author,
  record,
  replyCount,
  viewer,
  kind = "sub",
}: PostViewType & { kind?: string }) {
  if (!isPostRecord(record)) return null;
  const { text: raw, facets = [] } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <Link href={`/profile/${author.handle}/post/${uri.split("/").pop()}`}>
      <article
        className={cn("border-foreground/20 py-2 my-2", {
          "border-t": kind === "reply",
          "border-b": kind !== "reply",
        })}
      >
        <AuthorInfo {...author} />
        <section className="ml-12">
          <p className="text-base">{text}</p>
          <DecryptView facets={facets} viewer={viewer} uri={uri} sub />
        </section>
        <LinkToBskyApp uri={uri} className="ml-12" />
        <section className="ml-12 text-foreground/60 text-xs">
          <Mention count={replyCount ?? 0} uri={uri} />
        </section>
      </article>
    </Link>
  );
}

function LinkToBskyApp({
  uri,
  className,
}: {
  uri: string;
  className?: string;
}) {
  const path = uriToPath(uri);
  return (
    <Link
      href={`https://bsky.app${path}`}
      className={`text-foreground/60 text-xs pb-1 hover:underline ${className}`}
    >
      블루스카이에서 보기 <ExternalLink className="inline" size={12} />
    </Link>
  );
}
