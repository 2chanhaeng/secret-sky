import { useCurrentFeed } from "@/hooks/use-current-feed";
import { FeedViewPost, GetTimelineResponse } from "@/types/bsky";
import { useCallback, useState } from "react";

interface FeedViewPostWithKey extends FeedViewPost {
  key: string;
}

export const useFeedPosts = () => {
  const feed = useCurrentFeed();
  const [posts, setPosts] = useState<FeedViewPostWithKey[]>([]);
  const [cursor, setCursor] = useState("");
  const updateFeed = useCallback(() => {
    if (feed.type === "timeline") {
      fetch(`/api/timeline?cursor=${cursor}`)
        .then((res) => res.json() as unknown as GetTimelineResponse)
        .then(({ feed, cursor }) => {
          setPosts(removeDuplicates(feed));
          setCursor(cursor ?? "");
        })
        .catch(console.error);
    }
  }, [feed, cursor]);
  return { posts, updateFeed };
};

const removeDuplicates =
  (newPosts: FeedViewPost[]) =>
  (prev: FeedViewPostWithKey[]): FeedViewPostWithKey[] => {
    const posts: FeedViewPostWithKey[] = newPosts.map((post) => ({
      ...post,
      key: getKey(post),
    }));
    const keys = new Set(prev.map((post) => post.key));
    return [
      ...prev,
      ...posts.filter((post) => !keys.has(post.key)),
    ];
  };

const getKey = (post: FeedViewPost) =>
  post.reason
    ? `${post.post.uri}/${post.reason.indexedAt ?? ""}`
    : post.post.uri;
