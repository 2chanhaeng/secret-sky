import { isPostRecord, isPostView, isReasonRepost } from "@/lib/pred";
import AuthorInfo from "../AuthorInfo";
import DecryptFacetView from "./DecryptFacetView";
import { Facet, FeedViewPost, PostViewType, ReplyRef } from "@/types/bsky";
import Link from "next/link";
import { uriToPath } from "@/lib/uri";
import { EllipsisVertical, Repeat2 } from "lucide-react";
import EmbedView from "./EmbedView";
import AuthorAvatar from "../AuthorAvatar";
import PostFooter from "./PostFooter";
import { removeSuffixLink } from "@/lib/utils";
import PostText from "./PostText";

export function MainPostView(post: PostViewType) {
  const { uri, author, record } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, createdAt, facets, embed } = record;
  const date = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
  const text = removeSuffixLink(raw);
  return (
    <article>
      <AuthorInfo {...author} />
      <section>
        <PostText text={text} facets={facets} className="text-lg" />
        <DecryptFacetView facets={facets} uri={uri} />
        <EmbedView uri={uri} embed={embed} />
      </section>
      <p className="text-foreground/60 text-xs pb-1 flex gap-2">{date}</p>
      <PostFooter {...post} />
    </article>
  );
}

export function SubPostView(post: PostViewType) {
  const { uri, author, record, embed } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets } = record;
  const text = removeSuffixLink(raw);
  return (
    <article className="border-foreground/20 py-2 mt-2 border-t flex gap-2">
      <div className="col-span-full">
        <AuthorAvatar {...author} />
      </div>
      <section className="w-full">
        <AuthorInfo {...author} variant="sub" />
        <Link href={`/profile/${author.handle}/post/${uri.split("/").pop()}`}>
          <PostText text={text} facets={facets} className="text-base" />
          <DecryptFacetView facets={facets} uri={uri} sub />
          <EmbedView uri={uri} embed={embed} />
        </Link>
        <PostFooter {...post} />
      </section>
    </article>
  );
}

export function FeedThreadView({ post, reason, reply }: FeedViewPost) {
  return (
    <section className="border-foreground/20 py-2 border-t flex flex-col gap-2">
      <RepostBy {...reason} />
      {!reason && <RootParent reply={reply} />}
      <FeedPostView {...post} />
    </section>
  );
}

function PostViewContent({
  uri,
  text,
  facets = [],
}: {
  uri: string;
  text: string;
  facets?: Facet[];
}) {
  const path = uriToPath(uri);

  return (
    <Link href={path}>
      <PostText text={text} facets={facets} className="text-base" />
      <DecryptFacetView facets={facets} uri={uri} sub />
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

function RootParent({ reply }: { reply?: ReplyRef }) {
  if (!reply) return null;
  const { root, parent } = reply;
  const isDifferent = root?.uri !== parent?.uri;
  const url = (root?.uri as string) || (parent?.uri as string);
  const path = url ? uriToPath(url) : "";
  return (
    <>
      {isDifferent && (
        <>
          <ParentPostView {...root} />
          <Link className="mx-auto" href={path}>
            <EllipsisVertical size={16} className="text-foreground/60" />
          </Link>
        </>
      )}
      <ParentPostView {...parent} />
    </>
  );
}

function ParentPostView(post: Record<string, unknown> | undefined) {
  if (!isPostView(post)) return null;
  return <FeedPostView {...post} />;
}

function FeedPostView(post: PostViewType | undefined) {
  if (!post) return null;
  const { author, uri, record } = post;
  let embed: unknown = post.embed;

  if (!isPostRecord(record)) return null;
  if (!embed) embed = record.embed;
  const { text: raw, facets } = record;
  const text = removeSuffixLink(raw);
  const path = uriToPath(uri);

  return (
    <article className="flex gap-2 col-span-full">
      <div>
        <AuthorAvatar {...author} />
        <Link href={path} className="block h-full" />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <AuthorInfo {...author} variant="sub" />
        <PostViewContent uri={uri} text={text} facets={facets} />
        <EmbedView uri={uri} embed={embed} sub />
        <PostFooter {...post} />
      </div>
    </article>
  );
}
