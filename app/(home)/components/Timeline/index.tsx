"use client";

import Observer from "@/components/Observer";
import { FeedThreadView } from "@/components/PostView";
import { useTimeline } from "@/context/timeline";

export default function Timeline() {
  const { posts, update } = useTimeline();

  return (
    <section style={{ overflowAnchor: "none" }}>
      {posts.map(({ key, ...post }, i, { length }) =>
        i !== length - 10 ? (
          <FeedThreadView key={key} {...post} />
        ) : (
          <>
            <FeedThreadView key={key} {...post} />
            <Observer callback={update} />
          </>
        )
      )}
      <Observer callback={update} />
    </section>
  );
}
