"use client";

import { useModerationPrefs } from "@/hooks/use-pref";
import { getFeed, getListFeed } from "@/lib/api";
import { DEFAULT_TIMELINE_FEED } from "@/lib/const";
import { isPostRecord, isReasonRepost } from "@/lib/pred";
import {
  FeedViewPost,
  GetTimelineResponse,
  ModerationPrefs,
  MutedWord,
  PostRecord,
  PostViewType,
} from "@/types/bsky";
import { FeedInfo } from "@/types/feed";
import { FeedViewPostWithKey } from "@/types/timeline";
import { redirect } from "next/navigation";
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
  init: () => Promise<void>;
}

export const useFeedStore = (): FeedStoreType => {
  const [feed, setFeed] = useState<FeedInfo>(DEFAULT_TIMELINE_FEED);
  const [posts, setPosts] = useState<FeedViewPostWithKey[]>([]);
  const [cursor, setCursor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const mod = useModerationPrefs();

  useEffect(() => {
    setPosts([]);
    setCursor("");
  }, [feed]);

  const update = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { feed: posts, cursor: newCursor = "" } = //
      await fetchFeed(feed)(cursor);
    setPosts(updatePosts(posts, mod));
    setCursor(newCursor);
    setIsUpdating(false);
  }, [feed, cursor, isUpdating, mod]);

  const init = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    const { feed: posts, cursor: newCursor = "" } = //
      await fetchFeed(feed)("");
    setPosts(appendPosts(posts, mod));
    setCursor(newCursor);
    setIsUpdating(false);
  }, [feed, isUpdating, mod]);

  if (!mod) return INIT_TIMELINE_FEED;

  return { feed, posts, update, change: setFeed, init };
};

const updatePosts =
  (news: FeedViewPost[], mod: ModerationPrefs | undefined) =>
  (prev: FeedViewPostWithKey[]) => {
    const keyset = new Set(prev.map(({ key }) => key));
    const notMuted = appendKeys(news) //
      .filter(isPostWithKeyAndRecord)
      .filter((post) => !keyset.has(post.key)); //
    const toAdd = removeMutedPosts(mod)(notMuted);
    return [...prev, ...toAdd];
  };

interface PostWithKeyAndRecord extends FeedViewPostWithKey {
  post: PostViewType & {
    record: PostRecord;
  };
}

const appendPosts =
  (news: FeedViewPost[], mod: ModerationPrefs | undefined) =>
  (prev: FeedViewPostWithKey[]) => {
    const keyset = new Set(prev.map(({ key }) => key));
    const notMuted = appendKeys(news) //
      .filter(isPostWithKeyAndRecord)
      .filter((post) => !keyset.has(post.key)); //
    const toAdd = removeMutedPosts(mod)(notMuted);
    return [...toAdd, ...prev];
  };
const isPostWithKeyAndRecord = (
  post: FeedViewPostWithKey,
): post is PostWithKeyAndRecord => isPostRecord(post.post.record);

const removeMutedPosts =
  (mod: ModerationPrefs | undefined) => (posts: PostWithKeyAndRecord[]) => {
    const mutedPosts = new Set(mod?.hiddenPosts ?? []);
    const { muteFromAll, muteExcludeFollowing } = getMutedWords(mod);
    return posts
      .filter((post) => (post.post.author.viewer?.muted ?? false) === false)
      .filter((post) => (getMutedIfRepost(post) ?? false) === false)
      .filter((post) => !mutedPosts.has(post.post.uri))
      .filter((post) =>
        muteFromAll.length <= 0 ||
        !muteFromAll.some((word) => post.post.record.text.includes(word))
      )
      .filter((post) =>
        muteExcludeFollowing.length <= 0 ||
        post.post.author.viewer?.following ||
        !muteExcludeFollowing.some((word) =>
          post.post.record.text.includes(word)
        )
      );
  };

const getMutedIfRepost = (post: FeedViewPostWithKey) =>
  post.reason && isReasonRepost(post.reason) && post.reason.by?.viewer?.muted;

const getMutedWords = (mod: ModerationPrefs | undefined) => {
  if (!mod || !mod.mutedWords) {
    return {
      muteFromAll: [],
      muteExcludeFollowing: [],
    };
  }
  const filters = mod.mutedWords.map(getMutedWord).filter((word) =>
    word !== null
  );
  const muteFromAll = filters //
    .filter(({ excludeFollowing }) => !excludeFollowing) //
    .map(({ word, tagOnly }) => tagOnly ? `#${word}` : word);
  const muteExcludeFollowing = filters //
    .filter(({ excludeFollowing }) => excludeFollowing) //
    .map(({ word, tagOnly }) => tagOnly ? `#${word}` : word);
  return { muteFromAll, muteExcludeFollowing };
};

const getMutedWord = (word: MutedWord) => {
  const { value, actorTarget, targets, expiresAt } = word;
  if (expiresAt && new Date(expiresAt) < new Date()) return null;
  return {
    word: value,
    excludeFollowing: actorTarget === "exclude-following",
    tagOnly: !targets.some((target) => target === "content"),
  };
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
  fetch(`/api/timeline?cursor=${cursor}`) //
    .then((res) => res.json())
    .catch(() => redirect("/auth/refresh"));

const appendKeys = (posts: FeedViewPost[]): FeedViewPostWithKey[] =>
  posts.map((post) => ({ ...post, key: getKey(post) }));
const getKey = (post: FeedViewPost): string =>
  post.key
    ? (post.key as string)
    : post.reason
    ? `${post.post.uri}/${post.reason.indexedAt ?? ""}`
    : post.post.uri;

const INIT_TIMELINE_FEED: FeedStoreType = {
  feed: DEFAULT_TIMELINE_FEED,
  posts: [],
  update: async () => {},
  change: async () => {},
  init: async () => {},
};
const TimelineContext = createContext<FeedStoreType>(INIT_TIMELINE_FEED);
export const TimelineProvider = TimelineContext.Provider;
export const useTimeline = () => use(TimelineContext);
