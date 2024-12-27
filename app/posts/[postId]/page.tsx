import { getUri } from "./utils";
import Thread from "@/components/Thread";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const uri = await getUri(postId);

  return (
    <main>
      <Thread main={uri} />
    </main>
  );
}
