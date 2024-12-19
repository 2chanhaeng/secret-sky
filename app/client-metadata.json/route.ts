import client from "@/lib/client";

export const dynamic = "force-static";

export const GET = async () => Response.json(client.clientMetadata);
