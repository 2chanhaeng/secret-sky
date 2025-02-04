import { notFound, redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  console.log({ handle });
  if (handle.startsWith("did:") || handle.startsWith("did%3A")) {
    const getProfile =
      "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile";
    const withQuery = `${getProfile}?actor=${handle}`;
    const realHandle = await fetch(withQuery)
      .then((res) => res.json())
      .then((data) => data.handle)
      .catch(notFound);
    redirect(`/profile/${realHandle}`);
  }
  redirect(`https://bsky.app/profile/${handle}`);
}
