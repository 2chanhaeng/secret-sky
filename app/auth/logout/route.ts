import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { redirect } from "next/navigation";

export const GET = async () =>
  getAgent(client)
    .then(({ assertDid: did }) => client.revoke(did))
    .catch((e) => console.error(e))
    .finally(() => redirect("/auth/login"));
