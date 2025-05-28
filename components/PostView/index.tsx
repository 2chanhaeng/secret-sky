import {
  isPostRecord,
  isPostView,
  isReasonRepost,
  isThreadViewPost,
} from "@/lib/pred";
import AuthorInfo from "../AuthorInfo";
import DecryptFacetView from "./DecryptFacetView";
import {
  Facet,
  FeedViewPost,
  PostViewType,
  ReplyRef,
  ThreadViewPost,
} from "@/types/bsky";
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
    <article className="py-2">
      <AuthorInfo {...author} />
      <section>
        <PostText text={text} facets={facets} className="text-lg" />
        <DecryptFacetView facets={facets} uri={uri} />
        <EmbedView uri={uri} embed={embed} />
      </section>
      <p className="text-foreground/60 text-xs pl-2 pb-1 flex gap-2">{date}</p>
      <PostFooter {...post} />
    </article>
  );
}

export function SubPostView(post: PostViewType) {
  const { uri, author, record } = post;
  if (!isPostRecord(record)) return null;
  const { text: raw, facets, embed } = record;
  const text = removeSuffixLink(raw);
  const href = `/profile/${author.handle}/post/${uri.split("/").pop()}`;
  return (
    <article className="py-2 flex gap-2">
      <div className="col-span-full flex flex-col">
        <AuthorAvatar {...author} />
        <a href={href} className="block grow h-full"></a>
      </div>
      <section className="w-full">
        <AuthorInfo {...author} variant="sub" />
        <Link href={href}>
          <PostText text={text} facets={facets} className="text-base" />
          <DecryptFacetView facets={facets} uri={uri} sub />
        </Link>
        <EmbedView uri={uri} embed={embed} sub />
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
    <span className="text-foreground/60 text-xs flex gap-1 pl-12">
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
  return <FeedPostView {...post} isParent />;
}

function FeedPostView(
  post: (PostViewType & { isParent?: boolean }) | undefined
) {
  if (!post) return null;
  const { author, uri, record, isParent } = post;
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
        <Link href={path} className="h-full flex justify-center">
          {isParent && (
            <div className="w-0 h-full border-l-2 border-foreground/20"></div>
          )}
        </Link>
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

export function RecursiveParentPostView({
  parent,
}: {
  parent: ThreadViewPost["parent"];
}) {
  if (!parent) return null;
  if (!isThreadViewPost(parent)) return null;
  const { post, parent: grandparent } = parent;
  return (
    <>
      <RecursiveParentPostView parent={grandparent} />
      <SubPostView {...post} />
    </>
  );
}

export function ReplyPostView({
  replies,
}: {
  replies: ThreadViewPost["replies"];
}) {
  return (
    <>
      {replies
        ?.filter((reply) => (reply?.post as PostViewType)?.uri)
        .map((reply) => (
          <div key={(reply.post as PostViewType)!.uri}>
            <RecursiveReplyPostView reply={reply} />
          </div>
        ))}
    </>
  );
}
function RecursiveReplyPostView({
  reply,
}: {
  reply: Exclude<ThreadViewPost["replies"], undefined>[number] | undefined;
}) {
  if (!reply) return null;
  if (!isThreadViewPost(reply)) return null;
  const { post, replies } = reply;
  const grandReply = (replies ?? []).filter(isThreadViewPost).at(0);
  return (
    <>
      <SubPostView {...post} />
      <RecursiveReplyPostView reply={grandReply} />
    </>
  );
}
