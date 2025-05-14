import { notFound } from "next/navigation";
import { redirectIfHandleIsDid } from "../../utils";
import {
  /* isBlockedPost, isNotFoundPost  */
  isThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import {
  MainPostView,
  RecursiveParentPostView,
  ReplyPostView,
} from "@/components/PostView";
import { POST_TYPE } from "@/lib/const";
import { getAgentPage } from "@/lib/agent";
import client from "@/lib/client";

export default async function PostPage({
  params,
}: {
  params: Promise<{ handle: string; rkey: string }>;
}) {
  const { handle, rkey } = await params;
  await redirectIfHandleIsDid(handle, rkey);
  const uri = `at://${handle}/${POST_TYPE}/${rkey}`;
  const agent = await getAgentPage(client, `/profile/${handle}/post/${rkey}`);
  const {
    data: { thread },
  } = await agent.getPostThread({ uri });
  // if (isNotFoundPost(thread)) notFound();
  // if (isBlockedPost(thread)) // TODO: handle blocked post
  if (!isThreadViewPost(thread)) notFound();
  const { post, parent, replies } = thread;

  return (
    <main className="flex flex-col divide-y divide-foreground/20">
      <div className="flex flex-col">
        <RecursiveParentPostView parent={parent} />
        <MainPostView {...post} />
      </div>
      <ReplyPostView replies={replies} />
    </main>
  );
}
