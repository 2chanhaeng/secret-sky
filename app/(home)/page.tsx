import client from "@/lib/client";
import { getAgent } from "@/lib/agent";
import PostForm from "@/components/PostForm";

export default async function Home() {
  const agent = await getAgent(client, "/");
  const { data: author } = await agent.getProfile({ actor: agent.did! });
  return (
    <main>
      <PostForm author={author} />
    </main>
  );
}
