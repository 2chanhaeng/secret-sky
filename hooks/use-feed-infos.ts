import { useFeeds } from "./use-pref";
import { GeneratorRecord, ListRecord } from "@/types/bsky";
import { getRecord } from "@/lib/api";
import { isGeneratorRecord, isListRecord, isObj } from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";
import { useEffect, useState } from "react";
import { DBFeed, FeedInfo } from "@/types/feed";
import { DEFAULT_TIMELINE_FEED } from "@/lib/const";
import { useFeedsTable } from "@/context/db";

export const useFeedInfos = () => {
  const db = useFeedsTable();
  const prefFeeds = useFeeds();
  const [feeds, setFeeds] = useState<FeedInfo[]>([]);
  useEffect(() => {
    if (!globalThis.window) return;
    const updateInfos = async () =>
      db?.getAll<DBFeed>().then(async (dbFeeds) => {
        const toFetch = prefFeeds.filter(
          (f) =>
            f.type !== "timeline" &&
            !dbFeeds.find((df) => df.uri === f.value),
        );
        const fetches = toFetch.map(({ value }) => value).map(getRecord);
        const values = (await Promise.all(fetches)).map(({ uri, value }) => ({
          uri,
          ...value,
        }));
        return values;
      })
        .then((values) =>
          values
            .filter((feed) => isListRecord(feed) || isGeneratorRecord(feed))
            .forEach((feed) => db.add<DBFeed>(pickFeed(feed)))
        );
    const getInfos = async () =>
      db?.getAll<DBFeed>().then((dbFeeds) => {
        const newFeeds = prefFeeds
          .map(({ value: uri, pinned }) => {
            if (uri === "following") return DEFAULT_TIMELINE_FEED;
            const dbFeed = dbFeeds.find((df) => df.uri === uri);
            if (dbFeed) return { ...dbFeed, pinned };
            const type = uri.includes("generator") ? "feed" : "list";
            return {
              uri: uri,
              pinned,
              type,
              displayName: uri,
              description: "",
              avatar: "",
            };
          })
          .toSorted((a, b) => (!a.pinned && b.pinned ? 1 : -1));
        setFeeds(newFeeds);
      });
    updateInfos().then(getInfos).catch(console.error);
  }, [db, prefFeeds]);
  return feeds;
};

const pickFeed = ({
  uri,
  displayName,
  name,
  description = "",
  avatar,
}: (GeneratorRecord | ListRecord) & { uri: string }): DBFeed => {
  const type = uri.includes("generator") ? "feed" : "list";
  const dn = (displayName ?? name ?? uri) as string;
  return {
    uri,
    type,
    displayName: dn,
    description,
    avatar: getAvatarLink(uri, avatar),
  };
};

interface BlobRef {
  $type: "blob";
  ref: {
    $link: string;
  };
  mimeType: `image/${string}`;
  size: number;
}

const getAvatarLink = (uri: string, avatar: unknown) => {
  if (isBlob(avatar)) {
    const [repo] = parseAtUri(uri);
    const {
      ref: { $link: cid },
      mimeType,
    } = avatar;
    const ext = mimeType.split("/")[1];
    return `https://cdn.bsky.app/img/avatar/plain/${repo}/${cid}@${ext}`;
  }
  return "";
};

const isBlob = (blob: unknown): blob is BlobRef =>
  isObj(blob) && "$type" in blob && blob.$type === "blob";
