import { Agent } from "@atproto/api";
import { NextRequest } from "next/server";
import client from "@/lib/client";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;

  const { session } = await client.callback(params);
  const agent = new Agent(session);

  // Make Authenticated API calls
  const profile = await agent.getProfile({ actor: agent.did! });

  return Response.json(profile.data);
};
