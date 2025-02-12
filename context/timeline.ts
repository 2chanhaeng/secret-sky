"use client";

import { getFeed, getListFeed } from "@/lib/api";
import { DEFAULT_TIMELINE_FEED } from "@/lib/const";
import { FeedViewPost, GetTimelineResponse } from "@/types/bsky";
import { FeedInfo } from "@/types/feed";
import { FeedViewPostWithKey } from "@/types/timeline";
import { createContext, SetStateAction, use } from "react";

interface FeedStoreType {
  feed: FeedInfo;
  posts: FeedViewPostWithKey[];
  update: () => Promise<void>;
  init: () => Promise<void>;
}

export class FeedStore implements FeedStoreType {
  #feed: FeedInfo = DEFAULT_TIMELINE_FEED;
  #posts: Map<string, FeedViewPostWithKey>;
  #feeds: Map<string, string[]>;
  #cursor: Map<string, string>;
  #isUpdating = false;
  constructor() {
    this.#posts = new Map();
    this.#feeds = new Map();
    this.#cursor = new Map();
  }
  get feed() {
    return this.#feed;
  }
  set feed(feed: FeedInfo) {
    this.#feed = feed;
    this.init();
  }
  get posts() {
    return this.#getPostsFrom(this.feed.uri);
  }
  #getCursor(feed: string) {
    return this.#cursor.get(feed) ?? "";
  }
  #setCursor(feed: string, cursor: string) {
    this.#cursor.set(feed, cursor);
  }
  #getPosts(keys: string[]) {
    return keys.map((key) => this.#posts.get(key) ?? undefined) //
      .filter((post) => post !== undefined);
  }
  #updatePosts(posts: (FeedViewPost | FeedViewPostWithKey)[]) {
    appendKeys(posts).forEach((post) => this.#posts.set(post.key, post));
  }
  #getPostsFrom(feed: string) {
    if (!(this.#feeds.has(feed))) this.#feeds.set(feed, []);
    return this.#getPosts(this.#feeds.get(feed)!);
  }
  #getNonDupl(feed: string, posts: SetStateAction<FeedViewPost[]>) {
    if (!(this.#feeds.has(feed))) this.#feeds.set(feed, []);
    if (typeof posts === "function") posts = posts(this.#getPostsFrom(feed));
    const postsWithKeys = appendKeys(posts);
    this.#updatePosts(postsWithKeys);
    const duplKeys = postsWithKeys.map((post) => post.key);
    const keyset = new Set<string>();
    const keys = [];
    for (const key of duplKeys) {
      if (!keyset.has(key)) {
        keyset.add(key);
        keys.push(key);
      }
    }
    const prev = this.#feeds.get(feed)!.filter((key) => !keyset.has(key));

    return { keys, prev };
  }
  #initPosts(feed: string) {
    this.#feeds.set(feed, []);
    this.#cursor.set(feed, "");
  }
  #appendPostsTo(feed: string, posts: SetStateAction<FeedViewPost[]>) {
    const { keys, prev } = this.#getNonDupl(feed, posts);
    this.#feeds.set(feed, [...keys, ...prev]);
  }
  #pushPostsTo(feed: string, posts: SetStateAction<FeedViewPost[]>) {
    const { keys, prev } = this.#getNonDupl(feed, posts);
    this.#feeds.set(feed, [...prev, ...keys]);
  }
  async update() {
    if (this.#isUpdating) return;
    this.#isUpdating = true;
    const { uri } = this.#feed;
    const cursor = this.#getCursor(uri);
    await fetchFeed(this.#feed)(cursor).then(({ feed, cursor }) => {
      this.#pushPostsTo(uri, feed);
      this.#setCursor(uri, cursor ?? "");
    }).finally(() => {
      this.#isUpdating = false;
    });
  }
  async init() {
    if (this.#isUpdating) return;
    this.#isUpdating = true;
    const { uri } = this.#feed;
    this.#initPosts(uri);
    await fetchFeed(this.#feed)("").then(({ feed, cursor }) => {
      this.#appendPostsTo(uri, feed);
      this.#setCursor(uri, cursor ?? "");
    }).finally(() => {
      this.#isUpdating = false;
    });
  }
}

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
  init: async () => {},
});
export const TimelineProvider = TimelineContext.Provider;
export const useTimeline = () => use(TimelineContext);
