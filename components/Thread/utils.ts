import { notFound } from "next/navigation";
import { Agent } from "@atproto/api";
import { isLink } from "@atproto/api/dist/client/types/app/bsky/richtext/facet";
import { decrypt } from "@/lib/aes";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import prisma from "@/prisma";
import { Content } from "@/types/content";
import {
  isThreadViewPost,
  ThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export const getContent = async (uri: string): Promise<Content> => {
  const agent = await getAgent(client);
  const { key, iv, list } = await prisma.post
    .findUniqueOrThrow({
      where: { uri },
      select: { key: true, iv: true, list: true },
    })
    .catch(notFound);
  const [repo, , rkey] = uri.split("/").slice(-3);
  const { data: author } = await agent.getProfile({ actor: repo });
  if (!(agent.did === author.did || (await isReadable(list.uri)))) notFound();
  const {
    value: { facets, text, reply, createdAt },
  } = await agent.getPost({ repo, rkey }).catch(notFound);
  if (!facets) notFound();
  const links = facets.flatMap(({ features }) => features).filter(isLink);
  const link = links.find(({ uri }) => uri.match(/\/posts\/\w+\?value=(.+)$/));
  if (!link) notFound();
  const encrypted = new URLSearchParams(link.uri.split("?")[1]).get("value");
  if (!encrypted) notFound();
  const decrypted = await decrypt(encrypted, key, iv);
  const { data: thread } = await agent.getPostThread({ uri });

  const replies =
    (thread?.thread as ThreadViewPost).replies
      ?.filter(isThreadViewPost)
      ?.map(({ post: { uri } }) => uri ?? "")
      .filter(Boolean) ?? [];
  const open = getOpen(text);
  const parent = reply?.parent.uri;
  return {
    open,
    decrypted,
    author,
    parent,
    uri,
    list: list.uri,
    replies,
    createdAt: new Date(createdAt),
    link: link.uri.split("?")[0],
  };
};

const getOpen = (text: string): string =>
  text.split("\n\n").slice(1, -1).join("\n\n");

const isReadable = async (list: string): Promise<boolean> => {
  const agent = await getAgent(client);
  const { did } = agent;
  if (!did) return false;
  if (list.includes(did)) return true;
  return hasTarget(did)(getList(agent)(list));
};

interface UserScrapper {
  (list: string): (cursor?: string) => Promise<string[]>;
}

const limit = 100;

const getList: //
(agent: Agent) => UserScrapper = (agent) => (list) =>
  list.startsWith("at://")
    ? getUserList(agent)(list)
    : list.endsWith("/followers")
    ? getFollowers(agent)(list.split("/")[0])
    : getFollows(agent)(list.split("/")[0]);

const getUserList: //
(agent: Agent) => UserScrapper = (agent) => (list) => (cursor) =>
  agent.app.bsky.graph
    .getList({ list, cursor, limit })
    .then(({ data: { items } }) => items)
    .then((items) => items.map(({ subject: { did } }) => did));

const getFollowers: //
(agent: Agent) => UserScrapper = (agent) => (actor) => (cursor) =>
  agent.app.bsky.graph
    .getFollowers({ actor, cursor, limit })
    .then(({ data: { followers } }) => followers)
    .then((followers) => followers.map(({ did }) => did));

const getFollows: //
(agent: Agent) => UserScrapper = (agent) => (actor) => (cursor) =>
  agent.app.bsky.graph
    .getFollows({ actor, cursor, limit })
    .then(({ data: { follows } }) => follows)
    .then((follows) => follows.map(({ did }) => did));

const hasTarget =
  (target: string) =>
  async (f: (cursor?: string) => Promise<string[]>): Promise<boolean> => {
    let scraped: string[];
    let cursor: string | undefined;
    while ((scraped = await f(cursor))) {
      const scrapedSet = new Set(scraped);
      if (scrapedSet.has(target)) return true;
      if (scraped.length < limit) break;
      cursor = scraped.pop();
    }
    return false;
  };
