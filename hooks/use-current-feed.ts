import { DEFAULT_TIMELINE_FEED } from "@/lib/const";
import { FeedInfo } from "@/types/feed";
import { useEffect, useState } from "react";

export const useCurrentFeed = (): FeedInfo => {
  const [feed, setFeed] = useState<FeedInfo>(DEFAULT_TIMELINE_FEED);

  useEffect(() => {
    if (globalThis.localStorage) {
      const feed = globalThis.localStorage.getItem("currentFeed");
      if (feed) setFeed(JSON.parse(feed) as FeedInfo);
      else setFeed(DEFAULT_TIMELINE_FEED);
    }
  }, []);

  return feed;
};

export const setCurrentFeed = (feed: FeedInfo) => {
  if (globalThis.localStorage) {
    globalThis.localStorage.setItem("currentFeed", JSON.stringify(feed));
  }
};
