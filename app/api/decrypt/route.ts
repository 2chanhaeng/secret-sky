import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { extractEncrypted } from "@/lib/extract";
import { isPostRecord } from "@/lib/pred";
import prisma from "@/prisma";
import { NextRequest } from "next/server";
import { decrypt } from "@/lib/aes";

export const GET = async (req: NextRequest) => {
  const agent = await getAgent(client);
  try {
    const searchParams = req.nextUrl.searchParams;
    const uri = searchParams.get("uri");
    if (!uri) throw new Error("uri is required");
    const { data: { posts: [post] } } = await agent.getPosts({ uris: [uri] });
    const { viewer, record } = post;
    if (!viewer || viewer.replyDisabled) throw new Error("reply is disabled");
    if (!record || !isPostRecord(record)) throw new Error("invalid post");
    const encrypted = extractEncrypted(record);
    if (encrypted.length === 0) throw new Error("encrypted data not found");
    const { key, iv } = await prisma.post.findUniqueOrThrow({ where: { uri } });
    const decrypted = await decrypt(encrypted, key, iv);
    return Response.json(decrypted);
  } catch {
    return Response.json("");
  }
};
