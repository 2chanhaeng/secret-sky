import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { isThreadViewPost } from "@/lib/pred";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const uri = searchParams.get("uri");
  if (!uri) return Response.error();
  const agent = await getAgent(client);
  const { data: { thread } } = await agent.getPostThread({ uri });
  if (!isThreadViewPost(thread)) return Response.error();

  const { post: { viewer, cid } } = thread;
  if (!viewer || viewer.embeddingDisabled) return Response.error();

  const { repost } = viewer;
  let reposted;
  if (repost) {
    await agent.deleteRepost(repost);
    reposted = false;
  } else {
    await agent.repost(uri, cid);
    reposted = true;
  }

  return Response.json(reposted);
};
