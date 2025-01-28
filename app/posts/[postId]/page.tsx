import { getUri } from "./utils";
import Thread from "@/components/Thread";
import { getAgent } from "@/lib/agent";
import client from "@/lib/client";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  await getAgent(client, `/posts/${postId}`);
  const uri = await getUri(postId);

  return (
    <main>
      <Thread main={uri} />
    </main>
  );
}
