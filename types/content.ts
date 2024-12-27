import { Profile } from "./bsky";

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
}
