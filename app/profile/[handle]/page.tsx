import { redirect } from "next/navigation";
import { redirectIfHandleIsDid } from "./utils";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  await redirectIfHandleIsDid(handle);

  redirect(`https://bsky.app/profile/${handle}`);
}
