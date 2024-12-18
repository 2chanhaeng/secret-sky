import { post } from "@/actions/post";
import { getOrCreateKey } from "@/app/(home)/actions";
import { decrypt, encrypt } from "@/lib/aes";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";
import prisma from "@/prisma";
import { isLink } from "@atproto/api/dist/client/types/app/bsky/richtext/facet";
import Form from "next/form";
import { notFound } from "next/navigation";
import { isReadable } from "./utils";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const { uri, key, iv, list } = await prisma.post
    .findUniqueOrThrow({
      where: { id: postId },
      include: { list: { select: { uri: true } } },
    })
    .catch(notFound);
  if (!uri) notFound();
  const agent = await getAgent(client);
  const [repo, , rkey] = uri.split("/").slice(-3);
  const {
    data: { did, handle, avatar, displayName },
  } = await agent.getProfile({ actor: repo });
  if (!(agent.did === did || (await isReadable(list.uri)))) notFound();
  const {
    value: { facets },
  } = await agent.getPost({ repo, rkey }).catch(notFound);
  if (!facets) notFound();
  const links = facets.flatMap(({ features }) => features).filter(isLink);
  const link = links.find((facet) =>
    facet.uri.match(/\/posts\/\w+\?value=(.+)$/)
  );
  if (!link) notFound();
  const encrypted = new URLSearchParams(link.uri.split("?")[1]).get("value");
  console.log({ link: link.uri, encrypted });
  if (!encrypted) notFound();
  const content = await decrypt(encrypted, key, iv);

  return (
    <main>
      <h1>{displayName ?? handle}</h1>
      <img src={avatar} alt={displayName} />
      <p>{handle}</p>
      <a href={`https://bsky.app/profile/${did}`}>프로필</a>
      <p>{content}</p>
      <Form action={post}>
        <textarea name="content" />
        <textarea name="open" />
        <input type="hidden" name="list" value={list.uri} />
        <input type="hidden" name="parent" value={uri} />
        <button type="submit">Post</button>
      </Form>
    </main>
  );
}
