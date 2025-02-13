"use client";

import { getFeed, getListFeed } from "@/lib/api";
import { DEFAULT_TIMELINE_FEED } from "@/lib/const";
import { FeedViewPost, GetTimelineResponse } from "@/types/bsky";
import { FeedInfo } from "@/types/feed";
import { FeedViewPostWithKey } from "@/types/timeline";
import {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

interface FeedStoreType {
  feed: FeedInfo;
  posts: FeedViewPostWithKey[];
  update: () => Promise<void>;
  change: Dispatch<SetStateAction<FeedInfo>>;
}

export const useFeedStore = (): FeedStoreType => {
  const [feed, setFeed] = useState<FeedInfo>(DEFAULT_TIMELINE_FEED);
  const [posts, setPosts] = useState<FeedViewPostWithKey[]>([]);
  const [cursor, setCursor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setPosts([]);
    setCursor("");
  }, [feed]);

  const update = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { feed: posts, cursor: newCursor = "" } = //
      await fetchFeed(feed)(cursor);
    setPosts(updatePosts(posts));
    setCursor(newCursor);
    setIsUpdating(false);
  }, [feed, cursor, isUpdating]);
  const change = setFeed;

  return { feed, posts, update, change };
};

const updatePosts = (news: FeedViewPost[]) => (prev: FeedViewPostWithKey[]) => {
  const keyset = new Set(prev.map(({ key }) => key));
  const toAdd = appendKeys(news).filter((post) => !keyset.has(post.key));
  return [...prev, ...toAdd];
};

const fetchFeed = ({
  type,
  uri,
}: { type: string; uri: string }) =>
(cursor: string) => {
  if (type === "list") return getListFeed(uri, cursor);
  if (type === "feed") return getFeed(uri, cursor);
  return getTimeline(cursor);
};

const getTimeline = (cursor: string): Promise<GetTimelineResponse> =>
  fetch(`/api/timeline?cursor=${cursor}`).then((res) => res.json());

const appendKeys = (posts: FeedViewPost[]): FeedViewPostWithKey[] =>
  posts.map((post) => ({ ...post, key: getKey(post) }));
const getKey = (post: FeedViewPost): string =>
  post.key
    ? (post.key as string)
    : post.reason
    ? `${post.post.uri}/${post.reason.indexedAt ?? ""}`
    : post.post.uri;

const TimelineContext = createContext<FeedStoreType>({
  feed: DEFAULT_TIMELINE_FEED,
  posts: [],
  update: async () => {},
  change: async () => {},
});
export const TimelineProvider = TimelineContext.Provider;
export const useTimeline = () => use(TimelineContext);
