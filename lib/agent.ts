import { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAgent: //
(client: NodeOAuthClient, redirectTo?: string) => Promise<Agent> = async ( //
  client,
  redirectTo = "/"
) => {
  const did = (await cookies()).get("did")?.value;
  if (!did) redirect("/auth/login");
  const session = await client
    .restore(did)
    .catch(() => redirect(`/auth/login?redirectTo=${redirectTo}`));
  const agent = new Agent(session);
  return agent;
};
