import { getAgent } from "@/lib/agent";
import client from "@/lib/client";

export const GET = async () => {
  const agent = await getAgent(client);
  try {
    const pref = await agent.getPreferences();
    return Response.json(pref);
  } catch {
    return Response.error();
  }
};
