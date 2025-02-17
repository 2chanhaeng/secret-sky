"use server";

import { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAgent: //
  (client: NodeOAuthClient) => Promise<Agent> = //
  async (client) => {
    const did = (await cookies()).get("did")?.value;
    if (!did) throw new Error("Unauthorized");
    const agent = await client
      .restore(did!)
      .then((session) => new Agent(session))
      .catch(() => null);
    if (!agent) throw new Error("Expired");
    return agent;
  };

export const getAgentPage: //
  (client: NodeOAuthClient, redirectTo: string) => Promise<Agent> = //
  async (client, redirectTo) => {
    const did = (await cookies()).get("did")?.value;
    if (!did) redirect(`/auth/login?redirectTo=${redirectTo}`);
    const agent = await client
      .restore(did!)
      .then((session) => new Agent(session))
      .catch(() => null);
    if (!agent) redirect(`/auth?handle=${did}&redirectTo=${redirectTo}`);
    return agent;
  };
