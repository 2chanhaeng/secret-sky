"use client";

import { useFeedPosts } from "./hooks";
import Observer from "@/components/Observer";
import { FeedPostView } from "@/components/PostView";

export default function Timeline() {
  const { posts, update } = useFeedPosts();

  return (
    <section style={{ overflowAnchor: "none" }}>
      {posts.map(({ key, ...post }, i, { length }) =>
        i !== length - 10 ? (
          <FeedPostView key={key} {...post} />
        ) : (
          <>
            <FeedPostView key={key} {...post} />
            <Observer callback={update} />
          </>
        )
      )}
      <Observer callback={update} />
    </section>
  );
}
