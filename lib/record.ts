import { ThreadgateType } from "@/types/threadgate";
import {
  APPLY_WRITE_TYPE,
  POSTGATE_DISABLE_RULE,
  POSTGATE_TYPE,
  THREADGATE_TYPE,
} from "./const";
import { getRkey } from "./uri";

export const createThreadgateRecord = (
  uri: string,
  createdAt: string,
  allow: ThreadgateType[],
) => ({
  $type: APPLY_WRITE_TYPE,
  collection: THREADGATE_TYPE,
  rkey: getRkey(uri),
  value: {
    $type: THREADGATE_TYPE,
    post: uri,
    createdAt,
    allow,
  },
});

export const createDisablePostgateRecord = (
  uri: string,
  createdAt: string,
) => ({
  $type: APPLY_WRITE_TYPE,
  collection: POSTGATE_TYPE,
  rkey: getRkey(uri),
  value: {
    $type: POSTGATE_TYPE,
    post: uri,
    createdAt,
    embeddingRules: [POSTGATE_DISABLE_RULE],
  },
});
