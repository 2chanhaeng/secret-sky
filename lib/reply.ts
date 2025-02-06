import type { Agent } from "@atproto/api";
import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { parseAtUri } from "./uri";

export const getReply =
  (agent: Agent) => async (uri?: string): Promise<ReplyRef | undefined> => {
    if (!uri) return undefined;
    const [repo, , rkey] = parseAtUri(uri);
    const {
      value: { reply },
      cid,
    } = await agent.getPost({ repo, rkey });
    const parent = { uri, cid };
    const root = reply ? reply.root : parent;
    return { parent, root };
  };
