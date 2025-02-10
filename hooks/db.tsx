import { BaseProfile } from "@/types/profile";
import {
  IndexedDB,
  IndexedDBProps,
  initDB,
  useIndexedDB,
} from "react-indexed-db-hook";
import { useEffect, useState } from "react";
import { useFeeds, usePref } from "./use-pref";
import { GeneratorRecord, ListRecord, SavedFeed } from "@/types/bsky";
import { getRecord } from "@/lib/api";
import { isGeneratorRecord, isListRecord, isObj } from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";

export const SecretSkyDBVersion1Schema: IndexedDBProps = {
  name: "SecretSkyDB",
  version: 2,
  objectStoresMeta: [
    {
      store: "accounts",
      storeConfig: { keyPath: "did", autoIncrement: false },
      storeSchema: [
        { name: "did", keypath: "did", options: { unique: true } },
        { name: "handle", keypath: "handle", options: { unique: true } },
        { name: "avatar", keypath: "avatar", options: { unique: false } },
        {
          name: "displayName",
          keypath: "displayName",
          options: { unique: false },
        },
      ],
    },
    {
      store: "feeds",
      storeConfig: { keyPath: "uri", autoIncrement: false },
      storeSchema: [
        { name: "type", keypath: "type", options: { unique: false } },
        { name: "uri", keypath: "uri", options: { unique: true } },
        {
          name: "displayName",
          keypath: "displayName",
          options: { unique: false },
        },
        {
          name: "description",
          keypath: "description",
          options: { unique: false },
        },
        { name: "avatar", keypath: "avatar", options: { unique: false } },
      ],
    },
  ],
} as const;

interface DBFeed {
  type: string;
  uri: string;
  displayName: string;
  description: string;
  avatar: string;
}

initDB(SecretSkyDBVersion1Schema);

export function DBProvider({ children }: { children: React.ReactNode }) {
  return <IndexedDB {...SecretSkyDBVersion1Schema}>{children}</IndexedDB>;
}

export const useAccountUpdate = (profile: BaseProfile) => {
  const db = useIndexedDB("accounts");
  useEffect(() => {
    db.getByID<BaseProfile>(profile.did).then((p) => {
      if (!p) db.add<BaseProfile>(profile);
      else db.update<BaseProfile>(profile);
    });
  }, [db, profile]);
};

export const useLoggedAccounts = (current: string) => {
  const db = useIndexedDB("accounts");
  const [accounts, setAccounts] = useState<BaseProfile[]>([]);
  useEffect(() => {
    db.getAll<BaseProfile>()
      .then((accounts) => accounts.filter((p) => p.did !== current))
      .then(setAccounts)
      .catch(console.error);
  }, [db, current]);
  return accounts;
};

export const useDeleteAccount = (did: string) => {
  const db = useIndexedDB("accounts");
  return () => db.deleteRecord(did);
};

interface FeedInfo extends DBFeed {
  pinned: boolean;
}

export const useFeedInfos = () => {
  const db = useIndexedDB("feeds");
  const prefFeeds = useFeeds();
  const [feeds, setFeeds] = useState<FeedInfo[]>([]);
  useEffect(() => {
    const updateInfos = async () =>
      db
        .getAll<DBFeed>()
        .then(async (dbFeeds) => {
          const toFetch = prefFeeds.filter(
            (f) =>
              f.type !== "timeline" && !dbFeeds.find((df) => df.uri === f.value)
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
      db.getAll<DBFeed>().then((dbFeeds) => {
        const newFeeds = prefFeeds
          .map(({ value: uri, pinned }) => {
            if (uri === "following")
              return {
                uri: "following",
                type: "timeline",
                displayName: "Following",
                description: "Following",
                avatar: "",
                pinned,
              };
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
