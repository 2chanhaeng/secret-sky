import { notFound } from "next/navigation";
import { redirectIfHandleIsDid } from "../../utils";
import {
  /* isBlockedPost, isNotFoundPost  */
  isThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { MainPostView, SubPostView } from "@/components/PostView";
import { PostViewType } from "@/types/bsky";
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
    <main>
      {parent && <SubPostView {...(parent.post as PostViewType)} />}
      <MainPostView {...post} />
      {replies
        ?.filter((reply) => (reply?.post as PostViewType)?.uri)
        .map((reply) => (
          <SubPostView
            key={(reply.post as PostViewType)!.uri}
            {...(reply.post as PostViewType)}
          />
        ))}
    </main>
  );
}
