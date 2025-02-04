import { notFound, redirect } from "next/navigation";

export const redirectIfHandleIsDid = async (actor: string, rkey?: string) => {
  if (actor.startsWith("did:") || actor.startsWith("did%3A")) {
    const getProfile =
      "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile";
    const withQuery = `${getProfile}?actor=${actor}`;
    const realHandle = await fetch(withQuery)
      .then((res) => res.json())
      .then((data) => data.handle)
      .catch(notFound);
    const redirectTo = rkey
      ? `/profile/${realHandle}/post/${rkey}`
      : `/profile/${realHandle}`;
    redirect(redirectTo);
  }
};
