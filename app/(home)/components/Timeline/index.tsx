"use client";

import { useFeedPosts } from "./hooks";
import Observer from "@/components/Observer";
import { FeedPostView } from "@/components/PostView";

export default function Timeline() {
  const { posts, updateFeed } = useFeedPosts();
  console.log(posts);
  return (
    <section>
      {posts.map((post) => (
        <FeedPostView
          key={`${post.post.uri}/${crypto.randomUUID()}`}
          {...post}
        />
      ))}
      <Observer callback={updateFeed} />
    </section>
  );
}
