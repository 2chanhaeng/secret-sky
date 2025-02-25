import { isPostRecord } from "@/lib/pred";
import DecryptFacetView from "../../DecryptFacetView";
import AuthorInfo from "@/components/AuthorInfo";
import Link from "next/link";
import { parseAtUri } from "@/lib/uri";
import ImageView from "../ImageView";
import { PostViewType, ViewRecord } from "@/types/bsky";

const CLASSNAME = "rounded-lg overflow-hidden gap-1 border flex flex-col";

export default function QuotedPostView({
  post,
}: {
  post: PostViewType | ViewRecord;
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
    <article className={`${CLASSNAME} p-4`}>
      <AuthorInfo {...author} variant="quoted" />
      <Link href={path}>
        <p>{text}</p>
        <DecryptFacetView facets={facets} uri={uri} />
      </Link>
      <ImageView uri={uri} embed={embed} />
    </article>
  );
}
