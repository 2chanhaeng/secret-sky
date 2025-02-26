import { FeedViewPost } from "@/types/bsky";

export interface FeedViewPostWithKey extends FeedViewPost {
  key: string;
}
