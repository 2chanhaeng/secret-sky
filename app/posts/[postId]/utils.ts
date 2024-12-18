import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { Agent } from "@atproto/api";

export const isReadable = async (list: string): Promise<boolean> => {
  const agent = await getAgent(client);
  const { did } = agent;
  if (!did) return false;
  return hasTarget(did)(getList(agent)(list));
};

interface UserScrapper {
  (list: string): (cursor?: string) => Promise<string[]>;
}

const getList: //
  (agent: Agent) => UserScrapper = //
  (agent) => (list) =>
    list.startsWith("at://")
      ? getUserList(agent)(list)
      : list.endsWith("/followers")
      ? getFollowers(agent)(list.split("/")[0])
      : getFollows(agent)(list.split("/")[0]);

const getUserList: //
  (agent: Agent) => UserScrapper = //
  (agent) => (list) => (cursor) =>
    agent.app.bsky.graph.getList({ list, cursor })
      .then(({ data: { items } }) => items)
      .then((items) => items.map(({ subject: { did } }) => did));

const getFollowers: //
  (agent: Agent) => UserScrapper = //
  (agent) => (actor) => (cursor) =>
    agent.app.bsky.graph.getFollowers({ actor, cursor })
      .then(({ data: { followers } }) => followers)
      .then((followers) => followers.map(({ did }) => did));

const getFollows: //
  (agent: Agent) => UserScrapper = //
  (agent) => (actor) => (cursor) =>
    agent.app.bsky.graph.getFollows({ actor, cursor })
      .then(({ data: { follows } }) => follows)
      .then((follows) => follows.map(({ did }) => did));

const hasTarget //
 = (target: string) =>
async (f: (cursor?: string) => Promise<string[]>): Promise<boolean> => {
  let scraped: string[];
  let cursor: string | undefined;
  while (scraped = await f(cursor)) {
    const scrapedSet = new Set(scraped);
    if (scrapedSet.has(target)) return true;
    if (scraped.length < 2 || scrapedSet.has(cursor ?? "")) return false;
    cursor = scraped.pop();
  }
  return false;
};
