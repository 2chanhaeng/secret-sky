import { useTimeline } from "@/context/timeline";
import { useCallback, useEffect, useState } from "react";

export const useFeedPosts = () => {
  const timeline = useTimeline();
  const [posts, setPosts] = useState(timeline.posts);

  useEffect(() => {
    setPosts(timeline.posts);
  }, [timeline.posts]);

  const update = useCallback(() => {
    return timeline.update();
  }, [timeline]);

  return { posts, update };
};
