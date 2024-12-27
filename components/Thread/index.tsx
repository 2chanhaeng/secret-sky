import ThreadItem from "./Item";
import ThreadMain from "./Main";
import { getContent } from "./utils";

export default async function Thread({ main }: { main: string }) {
  const content = await getContent(main);
  return (
    <section>
      <ThreadParent uri={content.parent} />
      <ThreadMain content={content} />
      <ThreadReplies replies={content.replies} />
    </section>
  );
}

async function ThreadParent({ uri }: { uri?: string }) {
  if (!uri) return null;
  const content = await getContent(uri);
  return <ThreadItem content={content} />;
}

async function ThreadReplies({ replies }: { replies: string[] }) {
  if (!replies?.length) return null;
  return (
    <>
      {replies.map(async (uri) => {
        const content = await getContent(uri);

        return <ThreadItem key={uri} content={content} />;
      })}
    </>
  );
}
