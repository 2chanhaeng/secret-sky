import { getAgent } from "@/lib/agent";
import client from "@/lib/client";

export const GET = async () => {
  const agent = await getAgent(client);
  const actor = agent.assertDid;
  const { data: profile } = await agent.getProfile({ actor });
  return Response.json(profile);
};
