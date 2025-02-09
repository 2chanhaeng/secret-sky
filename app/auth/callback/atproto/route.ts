import { NextRequest } from "next/server";
import client from "@/lib/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Profile } from "@/types/bsky";
import { BaseProfile } from "@/types/profile";
import { getProfile } from "@/lib/api";
import { setProfile } from "@/lib/profile";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const cookie = await cookies();

  const {
    session: { sub },
  } = await client
    .callback(params)
    .catch((e) => {
      console.error(e);
      return ({ session: { sub: "error" } });
    });
  if (sub === "error") return redirect("/auth/login");
  const profile = await getProfile(sub);
  cookie.set("did", profile.did, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  setProfile(pickProfile(profile));

  const redirectTo = cookie.get("redirectTo")?.value ?? "/";
  cookie.delete("redirectTo");
  return redirect(redirectTo);
};

const pickProfile = (
  { did, handle, avatar = "", displayName }: Profile,
): BaseProfile => ({
  did,
  handle,
  avatar,
  displayName: displayName ?? handle,
});
