import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const agent = await getAgent(client);
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const { data } = await agent.getTimeline({ cursor });
    return Response.json(data);
  } catch {
    return Response.error();
  }
};
