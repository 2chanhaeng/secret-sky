import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { decryptFacet, getEncryptedFacet } from "@/lib/decrypt";
import { isPostRecord } from "@/lib/pred";
import prisma from "@/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const uri = searchParams.get("uri");
    if (!uri) throw new Error("uri is required");
    const agent = await getAgent(client);
    const { data: { posts: [post] } } = await agent.getPosts({ uris: [uri] });
    const { viewer, record } = post;
    if (!viewer || !viewer.replyDisabled) throw new Error("reply is disabled");
    if (!record || !isPostRecord(record)) throw new Error("invalid post");
    const { key, iv } = await prisma.post.findUniqueOrThrow({ where: { uri } });
    const facet = getEncryptedFacet(record.facets || []);
    const decrypted = await decryptFacet(facet, key, iv);
    return Response.json(decrypted);
  } catch {
    return Response.json("");
  }
};
