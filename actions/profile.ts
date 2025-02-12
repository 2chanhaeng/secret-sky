"use server";

import { BaseProfile } from "@/types/profile";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const LITERAL_PROFILE = "profile";

export const getCurrentProfile: () => Promise<BaseProfile | undefined> =
  async () =>
    cookies() //
      .then((cookie) => cookie.get(LITERAL_PROFILE)?.value) //
      .then((profile) => profile ? JSON.parse(profile) : undefined) //
      .catch(() => undefined);

export const setProfile: (profile: BaseProfile) => Promise<ResponseCookies> =
  async (profile) =>
    (await cookies()).set(LITERAL_PROFILE, JSON.stringify(profile));

export const removeProfile: () => Promise<ResponseCookies> = async () =>
  (await cookies()).delete(LITERAL_PROFILE);
