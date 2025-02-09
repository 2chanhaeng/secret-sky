import { getProfile } from "@/lib/api";
import { notFound, redirect } from "next/navigation";

export const redirectIfHandleIsDid = async (actor: string, rkey?: string) => {
  if (actor.startsWith("did:") || actor.startsWith("did%3A")) {
    const realHandle = await getProfile(actor)
      .then((data) => data.handle)
      .catch(notFound);
    const redirectTo = rkey
      ? `/profile/${realHandle}/post/${rkey}`
      : `/profile/${realHandle}`;
    redirect(redirectTo);
  }
};
