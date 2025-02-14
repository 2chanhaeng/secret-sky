"use server";

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
  if (!viewer || viewer.replyDisabled) return Response.error();

  const { like } = viewer;
  let liked;
  if (like) {
    await agent.deleteLike(like);
    liked = false;
  } else {
    await agent.like(uri, cid);
    liked = true;
  }

  return Response.json(liked);
};
