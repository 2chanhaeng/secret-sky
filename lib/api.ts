import {
  FeedView,
  GetFeedResponse,
  GetListFeedResponse,
  GetPostThreadResponse,
  GetRecordResponse,
  ListView,
  Profile,
} from "@/types/bsky";
import {
  BSKY_GET_FEED_API,
  BSKY_GET_FEED_GENERATORS_API,
  BSKY_GET_LIST_FEED_API,
  BSKY_GET_LISTS_API,
  BSKY_GET_POST_THREAD_API,
  BSKY_GET_PROFILE_API,
  BSKY_GET_RECORD_API,
} from "./const";
import { parseAtUri } from "./uri";

const parse = (res: Response) => res.json();

export const getProfile: (handle: string) => Promise<Profile> = (handle) =>
  fetch(`${BSKY_GET_PROFILE_API}?actor=${handle}`).then(parse);
export const getPostThread: (uri: string) => Promise<GetPostThreadResponse> = //
  (uri) => fetch(`${BSKY_GET_POST_THREAD_API}?uri=${uri}`).then(parse);
export const getRecord: (uri: string) => Promise<GetRecordResponse> = (uri) => {
  const [repo, collection, rkey] = parseAtUri(uri);
  const url =
    `${BSKY_GET_RECORD_API}?repo=${repo}&collection=${collection}&rkey=${rkey}`;
  return fetch(url).then(parse);
};
export const getFeedGenerators: () => Promise<FeedView[]> = () =>
  fetch(BSKY_GET_FEED_GENERATORS_API).then(parse).then(({ feeds }) => feeds);
export const getLists: () => Promise<ListView[]> = () =>
  fetch(BSKY_GET_LISTS_API).then(parse).then(({ lists }) => lists);
export const getFeed: (
  uri: string,
  cursor: string,
) => Promise<GetFeedResponse> = (uri, cursor) =>
  fetch(`${BSKY_GET_FEED_API}?feed=${uri}&cursor=${cursor}`).then(parse);
export const getListFeed: (
  uri: string,
  cursor: string,
) => Promise<GetListFeedResponse> = (
  uri,
  cursor,
) =>
  fetch(`${BSKY_GET_LIST_FEED_API}?feed=${uri}&cursor=${cursor}`).then(parse);
