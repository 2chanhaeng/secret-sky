import { useTimeline } from "@/context/timeline";
import { useEffect, useState } from "react";

export const useFeedPosts = () => {
  const timeline = useTimeline();
  const [posts, setPosts] = useState(timeline.posts);

  useEffect(() => {
    setPosts(timeline.posts);
  }, [timeline.posts]);

  return { posts, update: timeline.update.bind(timeline) };
};
