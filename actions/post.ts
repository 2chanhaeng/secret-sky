"use server";

import { encrypt, genKey } from "@/lib/aes";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import { URL_BASE } from "@/lib/url";
import prisma from "@/prisma";
import {
  FOLLOWING_RULE,
  FollowingRule,
  LIST_RULE,
  ListRule,
  MENTION_RULE,
  MentionRule,
  ThreadgateType,
} from "@/types/threadgate";
import { Facet, PostRecord } from "@/types/bsky";
import { Agent, RichText } from "@atproto/api";
import { ReplyRef } from "@atproto/api/dist/client/types/app/bsky/feed/post";
import { redirect } from "next/navigation";
import { generateTID } from "@/lib/tid";

const APPLY_WRITE_TYPE = "com.atproto.repo.applyWrites#create";
const POST_TYPE = "app.bsky.feed.post";
const THREADGATE_TYPE = "app.bsky.feed.threadgate";

export const post = async (form: FormData) => {
  const agent = await getAgent(client);
  const createdAt = new Date();
  const repo = agent.assertDid;
  const rkey = generateTID(createdAt);

  const uri = `at://${repo}/${POST_TYPE}/${rkey}`;
  const {
    content,
    parent,
    open,
  } = Object.fromEntries(form) as Record<string, string>; //
  const key = await genKey();
  const { encrypted, iv } = await encrypt(content, key);
  const post = await createPostRecord(agent)({
    encrypted,
    repo,
    open,
    parent,
    createdAt,
    rkey,
  });
  const postWrites = {
    $type: APPLY_WRITE_TYPE,
    collection: POST_TYPE,
    rkey,
    value: post,
  };
  const allow = getThreadgate(form);
  const threadgateWrites = {
    $type: APPLY_WRITE_TYPE,
    collection: THREADGATE_TYPE,
    rkey,
    value: {
      $type: THREADGATE_TYPE,
      post: uri,
      createdAt: createdAt.toISOString(),
      allow,
    },
  };
  await agent.com.atproto.repo.applyWrites({
    repo,
    writes: [postWrites, threadgateWrites],
    validate: true,
  });

  await prisma.post.create({ data: { key, iv, uri } });
  const href = uriToUrl(uri);
  redirect(href);
};

const getThreadgate: (form: FormData) => ThreadgateType[] = (form) =>
  (form.getAll("allow") as string[])
    .map((rule) =>
      rule.startsWith("at://")
        ? ({
          $type: LIST_RULE,
          list: rule,
        } as ListRule)
        : ({
          $type: rule as typeof MENTION_RULE | typeof FOLLOWING_RULE,
        } as MentionRule | FollowingRule)
    );

const createPostRecord: //
  (agent: Agent) => //
  (
    props: {
      encrypted: string;
      repo: string;
      rkey: string;
      createdAt: Date;
      open?: string;
      parent?: string;
    },
  ) => //
  Promise<PostRecord> = (agent) =>
  async (
    { encrypted, repo, open = "", parent, rkey, createdAt },
  ) => {
    const text = createPostText(open);
    const rt = new RichText({ text });
    await rt.detectFacets(agent);
    if (rt.facets === undefined) rt.facets = [];
    rt.facets.push(createLinkFacet({ text, repo, rkey }));
    rt.facets.push(createEncryptFacet({ encrypted }));
    const reply = await getReply(agent)(parent);

    return ({
      $type: POST_TYPE,
      text: rt.text,
      facets: rt.facets,
      createdAt: createdAt.toISOString(),
      reply,
    });
  };
const TEXT_TO_LINK = "비밀글 보기";
const createPostText = (open: string) =>
  `#그늘셀프${open ? "\n\n" + open : ""}\n\n${TEXT_TO_LINK}`;
const createLinkFacet: (
  props: { text: string; repo: string; rkey: string },
) => Facet = (
  { text, repo, rkey },
) => {
  const uri = `${URL_BASE}/profile/${repo}/post/${rkey}`;
  const byteStart = getByteLength(text.slice(0, -TEXT_TO_LINK.length));
  const byteEnd = getByteLength(text);
  return {
    index: { byteStart, byteEnd },
    features: [{ $type: "app.bsky.richtext.facet#link", uri }],
  };
};

const createEncryptFacet: (props: { encrypted: string }) => Facet = ({
  encrypted,
}) => ({
  index: { byteStart: 0, byteEnd: 0 },
  features: [{ $type: "app.bsky.richtext.facet#encrypt", encrypted }],
});

const getReply =
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

const getByteLength = (str: string) => new TextEncoder().encode(str).length;

const uriToUrl = (uri: string) => {
  const [repo, , rkey] = parseAtUri(uri);
  return `https://bsky.app/profile/${repo}/post/${rkey}`;
};
const parseAtUri = (uri: string) => uri.split("/").slice(-3);
