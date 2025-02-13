"use client";

import Observer from "@/components/Observer";
import { FeedPostView } from "@/components/PostView";
import { useTimeline } from "@/context/timeline";

export default function Timeline() {
  const { posts, update } = useTimeline();

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
