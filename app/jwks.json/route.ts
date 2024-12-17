import client from "@/lib/client";

export const GET = async () => Response.json(client.jwks);
