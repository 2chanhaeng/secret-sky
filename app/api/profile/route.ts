import { getAgent } from "@/lib/agent";
import client from "@/lib/client";

export const GET = async (_: Request) => {
  const agent = await getAgent(client);
  try {
    const actor = agent.assertDid;
    const { data: profile } = await agent.getProfile({ actor });
    return Response.json(profile);
  } catch {
    return Response.error();
  }
};
