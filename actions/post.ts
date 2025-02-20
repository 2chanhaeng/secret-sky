"use server";

import { encrypt, genKey } from "@/lib/aes";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
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
import { CreateRecord, Facet } from "@/types/bsky";
import type { Agent } from "@atproto/api";
import { redirect } from "next/navigation";
import { generateTID } from "@/lib/tid";
import {
  APPLY_WRITE_TYPE,
  NO_AUTH_LABEL,
  POST_TYPE,
  SELF_LABEL,
  TEXT_TO_LINK,
} from "@/lib/const";
import { validateCreate } from "@atproto/api/dist/client/types/com/atproto/repo/applyWrites";
import { getRkey, uriToPath } from "@/lib/uri";
import {
  createDecryptLinkFacet,
  createEncryptFacet,
  detectFacets,
} from "@/lib/facet";
import {
  createDisablePostgateRecord,
  createThreadgateRecord,
} from "@/lib/record";
import { getReply } from "@/lib/reply";

export const post = async (
  _: undefined | Record<string, string>,
  form: FormData,
) => {
  const agent = await getAgent(client);
  const now = new Date();
  const createdAt = now.toISOString();
  const repo = agent.assertDid;
  const rkey = generateTID(now);

  const uri = `at://${repo}/${POST_TYPE}/${rkey}`;
  const {
    content = "",
    parent = undefined,
    open = "",
  } = Object.fromEntries(form) as Record<string, string>; //
  const postProps = { content, open, parent, createdAt, uri };
  const valid = validInput(postProps);
  if (valid) {
    return {
      message: valid,
      open,
      content,
    };
  }
  try {
    const postRecord = await createEncryptedPostRecord(agent)(postProps);
    const writes: CreateRecord[] = [postRecord];

    if (!parent) {
      const allow = getThreadgate(form);
      writes.push(createThreadgateRecord(uri, createdAt, allow));
    }
    writes.push(createDisablePostgateRecord(uri, createdAt));
    if (writes.map(validateCreate).every(({ success }) => success)) {
      await agent.com.atproto.repo.applyWrites({
        repo,
        writes,
        validate: true,
      });
    } else {
      console.error("Validation failed", writes.map(validateCreate));
      return {
        message: "작성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        open,
        content,
      };
    }
  } catch (e) {
    console.error(e);
    return {
      message:
        "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 지속될 경우 개발자에게 문의해주세요.",
      open,
      content,
    };
  }

  const href = uriToPath(uri);
  redirect(href);
};

const getThreadgate: (form: FormData) => ThreadgateType[] = (form) =>
  (form.getAll("allow") as string[])
    .map((rule) =>
      rule.startsWith("at://")
        ? ({ $type: LIST_RULE, list: rule } as ListRule)
        : ({
          $type: rule as typeof MENTION_RULE | typeof FOLLOWING_RULE,
        } as MentionRule | FollowingRule)
    );

interface EncryptPostProps {
  content: string;
  createdAt: string;
  open: string;
  parent?: string;
  uri: string;
}

const validInput = ({ content, open, parent }: EncryptPostProps) => {
  if (!content && !open) {
    return "내용이 없습니다.";
  }
  if (content && content.length > 1000) {
    return "비밀글은 1000자 이하로 작성해주세요.";
  }
  if (open && open.length > 250) {
    return "공개글은 250자 이하로 작성해주세요.";
  }
  if (parent && !parent.startsWith("at://")) {
    return "부모 글이 올바르지 않습니다.";
  }
};

const createEncryptedPostRecord: //
  (agent: Agent) => (props: EncryptPostProps) => Promise<CreateRecord> =
    (agent) => async ({ content, open, parent, createdAt, uri }) => {
      const props = { uri, open, content };
      const { text, facets } = await getTextAndFacets(agent)(props);
      const reply = await getReply(agent)(parent);
      const labels = {
        $type: SELF_LABEL,
        values: [{ val: NO_AUTH_LABEL }],
      };

      return ({
        $type: APPLY_WRITE_TYPE,
        collection: POST_TYPE,
        rkey: getRkey(uri),
        value: {
          $type: POST_TYPE,
          text,
          facets,
          createdAt,
          reply,
          labels,
        },
      });
    };

const getTextAndFacets: (agent: Agent) => (
  props: { uri: string; open: string; content: string },
) => Promise<{
  text: string;
  facets: Facet[];
}> = (agent) => async ({ uri, open, content }) => {
  const raw = content ? createPostText(open) : open;
  const { text, facets } = await detectFacets(agent)(raw);
  const encrypted = content
    ? [
      ...facets,
      createDecryptLinkFacet({ text, uri }),
      await getEncryptedFacet(uri, content),
    ]
    : facets;
  return { text, facets: encrypted };
};

const getEncryptedFacet = async (uri: string, content: string) => {
  const key = await genKey();
  const { encrypted, iv } = await encrypt(content, key);
  await prisma.post.create({ data: { key, iv, uri } });
  return createEncryptFacet({ encrypted });
};

const createPostText = (open: string) =>
  `${open ? "\n\n" + open : ""}\n\n${TEXT_TO_LINK}`;
