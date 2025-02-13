"use server";

import { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { redirect } from "next/navigation";
import { sessions } from "./cookie";

export const getAgent: //
  (client: NodeOAuthClient, redirectTo?: string) => Promise<Agent> = async ( //
    client,
    redirectTo = "/",
  ) => {
    const did = (await sessions.get())?.sub;
    if (!did) redirect(`/auth/login?redirectTo=${redirectTo}`);
    const agent = await client
      .restore(did)
      .then((session) => new Agent(session))
      .catch((e) => {
        console.error("getAgent error: ", e);
        redirect(`/auth/login?redirectTo=${redirectTo}`);
      });
    return agent;
  };
