"use server";

import { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAgent: //
  (client: NodeOAuthClient, redirectTo?: string) => Promise<Agent> = async ( //
    client,
    redirectTo,
  ) => {
    const did = (await cookies()).get("did")?.value;
    if (!did) redirectOrThrow(redirectTo);
    const agent = await client
      .restore(did!)
      .then((session) => new Agent(session))
      .catch((e) => {
        console.error("getAgent error: ", e);
        redirect(`/auth/login?redirectTo=${redirectTo}`);
      });
    return agent;
  };

const redirectOrThrow = (redirectTo?: string) => {
  if (redirectTo) redirect(`/auth/login?redirectTo=${redirectTo}`);
  else throw new Error("Unauthorized");
};
