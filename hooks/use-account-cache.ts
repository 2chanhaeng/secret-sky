import { useEffect, useState } from "react";
import { useProfile } from "./use-profile";

export const useAccountCache = <T>(
  path: string,
  initial?: T,
): T | null => {
  const defaults = initial ?? null;
  const [pref, setCache] = useState<T | null>(defaults);
  const did = useProfile()?.did;

  useEffect(() => {
    if (did) {
      getCache<T>(path, did).then(setCache).catch(() => setCache(defaults));
    }
  }, [path, did, defaults]);

  return pref;
};

export const useRefreshingAccountCache = (path: string) => {
  const did = useProfile()?.did;
  useEffect(() => {
    if (did) refreshCache(path, did);
  }, [path, did]);
};

const getCache = <T>(path: string, did: string) =>
  loadCache<T>(path, did).catch(() => refreshCache<T>(path, did));
export const refreshCache = <T>(path: string, did: string) =>
  cacheCache(path, did).then(() => loadCache<T>(path, did));
const loadCache = <T>(path: string, did: string) =>
  caches.open(did).then((cache) => cache.match(path))
    .then((match) => match!.json() as T);
const cacheCache = <T>(path: string, did: string) =>
  caches.open(did).then((cache) => cache.add(path));
