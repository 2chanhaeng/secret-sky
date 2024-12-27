"use server";

import { encrypt, genKey } from "@/lib/aes";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { URL_BASE } from "@/lib/url";
import prisma from "@/prisma";
import { Facet } from "@/types/bsky";
import { Agent, RichText } from "@atproto/api";
import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { redirect } from "next/navigation";

export const post = async (form: FormData) => {
  const agent = await getAgent(client);

  const {
    content,
    list: rawList,
    parent,
    open,
  } = Object.fromEntries(form) as Record<string, string>; //
  const list = getList(rawList, agent.did!);
  const { id: listId, key } = await getOrCreateKey(list);
  const { encrypted, iv } = await encrypt(content, key);
  const { id } = await prisma.post.create({ data: { listId, key, iv } });
  const uri = await createPost(agent)({ encrypted, id, open, parent });
  if (rawList === "current") {
    await prisma.list.update({ where: { id: listId }, data: { uri } });
  }
  await prisma.post.update({ where: { id }, data: { uri } });
  const href = uriToUrl(uri);
  redirect(href);
};

const getList = (rawList: string, did: string) => {
  if (rawList.startsWith("at://")) return rawList;
  if (rawList === "current") return `current/${crypto.randomUUID()}`;
  return `${did}/${rawList}`;
};

const getOrCreateKey: //
(uri: string) => Promise<{ id: string; key: string }> = async (uri) =>
  prisma.list.upsert({
    where: { uri },
    update: {},
    create: { uri, key: await genKey() },
    select: { id: true, key: true },
  });

const createPost: //
(agent: Agent) => //
(props: { encrypted: string; id: string; open?: string; parent?: string }) => //
Promise<string> =
  (agent) =>
  async ({ encrypted, id, open = "", parent }) => {
    const text = createPostText(open);
    const rt = new RichText({ text });
    await rt.detectFacets(agent);
    if (rt.facets === undefined) rt.facets = [];
    rt.facets.push(addOriginFacet(text, id, encrypted));
    const reply = await getReply(agent)(parent);

    const { uri } = await agent
      .post({ text: rt.text, facets: rt.facets, reply })
      .catch((e) => {
        console.error("Post creation error", e);
        throw e;
      });
    return uri;
  };
const TEXT_TO_LINK = "비밀글 보기";
const createPostText = (open: string) =>
  `#그늘셀프${open.length > 0 ? "\n\n" + open : ""}\n\n${TEXT_TO_LINK}`;
const addOriginFacet: (post: string, id: string, encrypted: string) => Facet = (
  //
  post,
  id,
  encrypted
) => {
  const uri = `${
    "https://secret-sky.vercel.app" // URL_BASE
  }/posts/${id}?value=${encrypted}`;
  const byteStart = getByteLength(post.slice(0, -TEXT_TO_LINK.length));
  const byteEnd = getByteLength(post);
  return {
    index: { byteStart, byteEnd },
    features: [{ $type: "app.bsky.richtext.facet#link", uri }],
  };
};
const getReply =
  (agent: Agent) =>
  async (uri?: string): Promise<ReplyRef | undefined> => {
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

const getByteLength = (str: string) => new TextEncoder().encode(str).length;

const uriToUrl = (uri: string) => {
  const [repo, , rkey] = parseAtUri(uri);
  return `https://bsky.app/profile/${repo}/post/${rkey}`;
};
const parseAtUri = (uri: string) => uri.split("/").slice(-3);
