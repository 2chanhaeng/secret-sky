export const MENTION_RULE = "app.bsky.feed.threadgate#mentionRule";
export const FOLLOWING_RULE = "app.bsky.feed.threadgate#followingRule";
export const FOLLOWER_RULE = "app.bsky.feed.threadgate#followerRule";
export const LIST_RULE = "app.bsky.feed.threadgate#listRule";

export interface MentionRule {
  $type: typeof MENTION_RULE;
}
export interface FollowingRule {
  $type: typeof FOLLOWING_RULE;
}
export interface FollowerRule {
  $type: typeof FOLLOWER_RULE;
}
export interface ListRule {
  $type: typeof LIST_RULE;
  list: string;
}
export type ThreadgateType = MentionRule | FollowingRule | ListRule;
