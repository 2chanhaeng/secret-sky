import { isPostRecord, isReasonRepost } from "@/lib/pred";
import AuthorInfo from "../AuthorInfo";
import DecryptView from "./DecryptView";
import Mention from "./Mention";
import { Facet, FeedViewPost, PostViewType } from "@/types/bsky";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { parseAtUri, uriToPath } from "@/lib/uri";
import { ExternalLink, Repeat2 } from "lucide-react";

export function MainPostView({
  uri,
  author,
  record,
  replyCount,
}: PostViewType) {
  if (!isPostRecord(record)) return null;
  const { text: raw, createdAt, facets } = record;
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
        <DecryptView facets={facets} uri={uri} />
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
  kind = "sub",
}: PostViewType & { kind?: string }) {
  if (!isPostRecord(record)) return null;
  const { text: raw, facets } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <article
      className={cn("border-foreground/20 py-2 my-2", {
        "border-t": kind === "reply",
        "border-b": kind !== "reply",
      })}
    >
      <AuthorInfo {...author} />
      <Link href={`/profile/${author.handle}/post/${uri.split("/").pop()}`}>
        <section className="ml-12">
          <p className="text-base">{text}</p>
          <DecryptView facets={facets} uri={uri} sub />
        </section>
      </Link>
      <LinkToBskyApp uri={uri} className="ml-12" />
      <section className="ml-12 text-foreground/60 text-xs">
        <Mention count={replyCount ?? 0} uri={uri} />
      </section>
    </article>
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

export function FeedPostView({ post, reason }: FeedViewPost) {
  const { record, uri, author, replyCount } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <article className="border-foreground/20 py-2 my-2 border-t">
      <RepostBy {...reason} />
      <AuthorInfo {...author} />
      <PostViewContent uri={uri} text={text} facets={facets} />
      <LinkToBskyApp uri={uri} className="ml-12" />
      <section className="ml-12 text-foreground/60 text-xs">
        <Mention count={replyCount ?? 0} uri={uri} />
      </section>
    </article>
  );
}

function PostViewContent({
  uri,
  text,
  facets,
}: {
  uri: string;
  text: string;
  facets?: Facet[];
}) {
  const [repo, , rkey] = parseAtUri(uri);
  return (
    <Link href={`/profile/${repo}/post/${rkey}`}>
      <section className="ml-12">
        <p className="text-base">{text}</p>
        <DecryptView facets={facets} uri={uri} sub />
      </section>
    </Link>
  );
}

function RepostBy(reason: FeedViewPost["reason"]) {
  if (!isReasonRepost(reason)) return null;
  const { handle, displayName } = reason.by;
  const name = displayName || handle;
  return (
    <span className="text-foreground/60 text-xs flex gap-1 ml-12">
      <Repeat2 size={16} />
      {name} 님이 재개시함
    </span>
  );
}
