import { isPostRecord, isPostView, isReasonRepost } from "@/lib/pred";
import AuthorInfo from "../AuthorInfo";
import DecryptView from "./DecryptView";
import { Facet, FeedViewPost, PostViewType, ReplyRef } from "@/types/bsky";
import Link from "next/link";
import { uriToPath } from "@/lib/uri";
import { EllipsisVertical, Repeat2 } from "lucide-react";
import EmbedView from "./EmbedView";
import AuthorAvatar from "../AuthorAvatar";
import PostFooter from "./PostFooter";

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

export function SubPostView(post: PostViewType) {
  const { uri, author, record, embed } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <article className="border-foreground/20 py-2 mt-2 border-t flex gap-2">
      <div className="col-span-full">
        <AuthorAvatar {...author} />
      </div>
      <section className="w-full">
        <AuthorInfo {...author} variant="sub" />
        <Link href={`/profile/${author.handle}/post/${uri.split("/").pop()}`}>
          <p className="text-base">{text}</p>
          <DecryptView facets={facets} uri={uri} sub />
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
      {!reason && <RootParent reply={reply} childAuthor={post.author.did} />}
      <FeedPostView {...post} />
    </section>
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
  const path = uriToPath(uri);
  return (
    <Link href={path}>
      <p className="text-base">{text}</p>
      <DecryptView facets={facets} uri={uri} sub />
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

function RootParent({
  reply,
  childAuthor,
}: {
  reply?: Partial<ReplyRef>;
  childAuthor: string;
}) {
  if (!reply) return null;
  const { root, parent } = reply;
  if (!isPostView(parent)) return null;
  if (parent?.author.did === childAuthor) return null;
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
  const { author, uri, embed, record } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets } = record;
  const text = raw.replace(/\n\n비밀글 보기$/, "");
  return (
    <article className="flex gap-2 col-span-full">
      <div className="">
        <AuthorAvatar {...author} />
      </div>
      <div className="flex flex-col gap-1">
        <AuthorInfo {...author} variant="sub" />
        <PostViewContent uri={uri} text={text} facets={facets} />
        <EmbedView uri={uri} embed={embed} />
        <PostFooter {...post} />
      </div>
    </article>
  );
}
