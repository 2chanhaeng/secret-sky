import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) =>
  getAgent(client) //
    .then((agent) => agent.getTimeline({ cursor: getCursor(req) })) //
    .then(({ data }) => Response.json(data))
    .catch(() => Response.error());

const getCursor = (req: NextRequest) =>
  req.nextUrl.searchParams.get("cursor") ?? undefined;
