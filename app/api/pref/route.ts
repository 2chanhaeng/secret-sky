import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { redirect } from "next/navigation";

export const GET = async () => {
  const agent = await getAgent(client);
  try {
    const pref = await agent.getPreferences();
    return Response.json(pref);
  } catch {
    redirect("/auth/logout");
  }
};
