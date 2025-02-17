import { isPostRecord, isPostView, isReasonRepost } from "@/lib/pred";
import AuthorInfo from "../AuthorInfo";
import DecryptView from "./DecryptView";
import Mention from "./Mention";
import { Facet, FeedViewPost, PostViewType, ReplyRef } from "@/types/bsky";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { parseAtUri, uriToPath } from "@/lib/uri";
import { ExternalLink, Repeat2 } from "lucide-react";
import Like from "./Like";
import { buttonVariants } from "../ui/button";
import EmbedView from "./EmbedView";

export function MainPostView(post: PostViewType) {
  const { uri, author, record } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, createdAt, facets, embed } = record;
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
        <EmbedView uri={uri} embed={embed} />
      </section>
      <p className="text-foreground/60 text-xs pb-1 flex gap-2">{date}</p>
      <PostFooter {...post} />
    </article>
  );
}

export function SubPostView(post: PostViewType & { kind?: string }) {
  const { uri, author, record, kind = "sub", embed } = post;
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
          <EmbedView uri={uri} embed={embed} />
        </section>
      </Link>
      <PostFooter {...post} />
    </article>
  );
}

function LinkToBskyApp({
  uri,
  className,
  iconSize = 16,
}: {
  uri: string;
  className?: string;
  iconSize: number;
}) {
  const path = uriToPath(uri);
  return (
    <Link
      href={`https://bsky.app${path}`}
      className={`${buttonVariants({ variant: "ghost" })} ${className}`}
    >
      <ExternalLink className="inline" size={iconSize} />
    </Link>
  );
}

export function FeedPostView({ post, reason, reply }: FeedViewPost) {
  const { record, uri, author } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets, embed } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <article className="border-foreground/20 py-2 my-2 border-t">
      <RepostBy {...reason} />
      {!reason && <RootParent {...reply} />}
      <AuthorInfo {...author} />
      <PostViewContent uri={uri} text={text} facets={facets} embed={embed} />
      <PostFooter {...post} />
    </article>
  );
}

function PostViewContent({
  uri,
  text,
  facets,
  embed,
}: {
  uri: string;
  text: string;
  facets?: Facet[];
  embed: unknown;
}) {
  const [repo, , rkey] = parseAtUri(uri);
  return (
    <Link href={`/profile/${repo}/post/${rkey}`}>
      <section className="ml-12">
        <p className="text-base">{text}</p>
        <DecryptView facets={facets} uri={uri} sub />
        <EmbedView uri={uri} embed={embed} />
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

function RootParent(reply: Partial<ReplyRef>) {
  if (!reply) return null;
  const { root, parent } = reply;
  const isDifferent = root?.uri !== parent?.uri;
  return (
    <>
      {isDifferent && <ParentPostView {...root} />}
      <ParentPostView {...parent} />
    </>
  );
}

export function ParentPostView(post: Record<string, unknown> | undefined) {
  if (!isPostView(post)) return null;
  const { record, uri, author, embed } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <>
      <AuthorInfo {...author} />
      <PostViewContent uri={uri} text={text} facets={facets} embed={embed} />
      <PostFooter {...post} />
    </>
  );
}
function PostFooter({
  uri,
  viewer,
  replyCount,
  likeCount,
  className = "",
  iconSize = 16,
}: PostViewType & {
  className?: string;
  iconSize?: number;
}) {
  return (
    <section
      className={`ml-12 text-foreground/60 text-xs flex justify-between has-[>:only-child]:justify-end ${className}`}
    >
      <Mention
        count={replyCount}
        uri={uri}
        viewer={viewer}
        iconSize={iconSize}
      />
      <Like uri={uri} count={likeCount} viewer={viewer} iconSize={iconSize} />
      <LinkToBskyApp uri={uri} iconSize={iconSize} />
    </section>
  );
}
