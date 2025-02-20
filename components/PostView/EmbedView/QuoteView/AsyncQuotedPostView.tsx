import QuotedPostView from "./QuotedPostView";
import { getPosts } from "@/lib/api";

export default async function AsyncQuotedPostView({ uri }: { uri: string }) {
  const data = await getPosts([uri]);
  console.log("data :", data);
  const {
    posts: [post],
  } = data;
  return <QuotedPostView post={post} />;
}
