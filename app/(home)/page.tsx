import client from "@/lib/client";
import { getAgent } from "@/lib/agent";
import PostForm from "@/components/PostForm";

export default async function Home() {
  await getAgent(client, "/");
  return (
    <main>
      <PostForm />
    </main>
  );
}
