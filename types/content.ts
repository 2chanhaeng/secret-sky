import { Profile } from "./bsky";
import type {
  BlockedPost,
  NotFoundPost,
  ThreadViewPost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
export interface Content {
  open: string;
  decrypted: string;
  author: Profile;
  parent?: string;
  uri: string;
  list: string;
  replies: string[];
  createdAt: Date;
  link: string;
  liked: boolean;
}

type NotDecryptedPost = NotFoundPost | BlockedPost | ThreadViewPost;

export interface DecryptedPost extends ThreadViewPost {
  decrypted: string;
  parent?: NotDecryptedPost | DecryptedPost;
  replies: (NotDecryptedPost | DecryptedPost)[];
}
