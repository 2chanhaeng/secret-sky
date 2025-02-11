export interface DBFeed {
  type: string;
  uri: string;
  displayName: string;
  description: string;
  avatar: string;
}
export interface FeedInfo extends DBFeed {
  pinned: boolean;
}
