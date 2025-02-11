import { useCurrentFeed } from "@/hooks/use-current-feed";
import { FeedViewPost, GetTimelineResponse } from "@/types/bsky";
import { useCallback, useState } from "react";

export const useFeedPosts = () => {
  const feed = useCurrentFeed();
  const [posts, setPosts] = useState<FeedViewPost[]>([]);
  const [cursor, setCursor] = useState("");
  const updateFeed = useCallback(() => {
    if (feed.type === "timeline") {
      fetch(`/api/timeline?cursor=${cursor}`)
        .then((res) => res.json() as unknown as GetTimelineResponse)
        .then(({ feed, cursor }) => {
          setPosts((prev) => [...prev, ...feed]);
          setCursor(cursor ?? "");
        })
        .catch(console.error);
    }
  }, [feed, cursor]);
  return { posts, updateFeed };
};
