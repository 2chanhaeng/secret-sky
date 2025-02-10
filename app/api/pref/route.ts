import { getAgent } from "@/lib/agent";
import client from "@/lib/client";

export const GET = async (_: Request) => {
  try {
    const agent = await getAgent(client);
    const pref = await agent.getPreferences();
    return Response.json(pref);
  } catch {
    return Response.error();
  }
};
