"use client";

import { useFeedPosts } from "./hooks";
import Observer from "@/components/Observer";
import { FeedPostView } from "@/components/PostView";

export default function Timeline() {
  const { posts, updateFeed } = useFeedPosts();

  return (
    <section style={{ overflowAnchor: "none" }}>
      {posts.map(({ key, ...post }) => (
        <FeedPostView key={key} {...post} />
      ))}
      <Observer callback={updateFeed} />
    </section>
  );
}
