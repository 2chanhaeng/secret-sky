import { notFound } from "next/navigation";
import { redirectIfHandleIsDid } from "../../utils";
import {
  /* isBlockedPost, isNotFoundPost  */
  isThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { MainPostView, SubPostView } from "@/components/PostView";
import { PostViewType } from "@/types/bsky";
import { SquarePen } from "lucide-react";
import Link from "next/link";

const POST_TYPE = "app.bsky.feed.post";

export default async function PostPage({
  params,
}: {
  params: Promise<{ handle: string; rkey: string }>;
}) {
  const { handle, rkey } = await params;
  await redirectIfHandleIsDid(handle, rkey);
  const agent = await getAgent(client, `/profile/${handle}/post/${rkey}`);
  const uri = `at://${handle}/${POST_TYPE}/${rkey}`;
  const {
    data: { thread },
  } = await agent.getPostThread({ uri });
  // if (isNotFoundPost(thread)) notFound();
  // if (isBlockedPost(thread)) // TODO: handle blocked post
  if (!isThreadViewPost(thread)) notFound();
  const { post, parent, replies } = thread;

  return (
    <main>
      {parent && <SubPostView {...(parent.post as PostViewType)} />}
      <MainPostView {...post} />
      {replies
        ?.filter((reply) => (reply?.post as PostViewType)?.uri)
        .map((reply) => (
          <SubPostView
            key={(reply.post as PostViewType)!.uri}
            kind="reply"
            {...(reply.post as PostViewType)}
          />
        ))}

      <Link
        href="/"
        className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full"
      >
        <SquarePen />
      </Link>
    </main>
  );
}
