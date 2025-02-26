import { isPostRecord } from "@/lib/pred";
import DecryptFacetView from "../../DecryptFacetView";
import AuthorInfo from "@/components/AuthorInfo";
import Link from "next/link";
import { parseAtUri } from "@/lib/uri";
import { PostViewType, ViewRecord } from "@/types/bsky";
import ExceptQuoteView from "../ExceptQuoteView";
import PostText from "../../PostText";

export default function QuotedPostView({
  post,
  sub,
}: {
  post: PostViewType | ViewRecord;
  sub?: boolean;
}) {
  const { author, uri } = post;
  const record =
    "record" in post
      ? (post as PostViewType).record
      : (post as ViewRecord).value;
  if (!isPostRecord(record)) return null;
  const { text, facets, embed } = record;
  const [repo, , rkey] = parseAtUri(uri);
  const path = `/profile/${repo}/post/${rkey}`;
  return (
    <article className="rounded-lg overflow-hidden gap-1 border flex flex-col p-4">
      <AuthorInfo {...author} variant="quoted" />
      <Link href={path}>
        <PostText text={text} facets={facets} />
        <DecryptFacetView facets={facets} uri={uri} />
      </Link>
      <ExceptQuoteView uri={uri} embed={embed} sub={sub} />
    </article>
  );
}
