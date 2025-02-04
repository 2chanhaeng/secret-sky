import { notFound } from "next/navigation";
import { redirectIfHandleIsDid } from "../../utils";
import { GetPostThreadResponse } from "@/types/bsky";
import {
  /* isBlockedPost, isNotFoundPost  */
  isThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import AuthorInfo from "@/components/AuthorInfo";

const GET_POST_THREAD =
  "https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread";
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
  console.log({
    isThreadViewPost: isThreadViewPost(thread),
    thread,
  });
  if (!isThreadViewPost(thread)) notFound();
  const {
    post: { author, viewer },
  } = thread;
  console.log({ author, viewer });

  return (
    <main>
      <AuthorInfo {...author} />
    </main>
  );
}
