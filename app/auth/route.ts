import { getProfile } from "@/lib/api";
import client from "@/lib/client";
import { getParam } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const setRedirectToFromSearchParam = async (req: NextRequest) => {
  await getRedirectToFrom("search")(req).then(setRedirectTo);
  return req;
};
const setRedirectToFromBody = async (req: NextRequest) => {
  await getRedirectToFrom("body")(req).then(setRedirectTo);
  return req;
};
const getRedirectToFrom = getParam("redirectTo");
const setRedirectTo = (redirectTo?: string | undefined | null): unknown =>
  redirectTo && cookies().then((c) => c.set("redirectTo", redirectTo));

const validateHandle = (handle: string) =>
  getProfile(handle).then((data) => {
    if ("error" in data || data.handle !== handle) {
      redirect("/auth/login?error=true");
    }
    return data.handle;
  });
const getAuthURL = (handle: string) => client.authorize(handle);

const redirectToAuthorize = async (handle?: string | null) =>
  handle
    ? validateHandle(handle)
      .then(getAuthURL)
      .then(({ href }) => href)
      .then(redirect)
    : redirect("/auth/login");

export const GET = async (req: NextRequest) =>
  setRedirectToFromSearchParam(req)
    .then(getParam("handle")("search"))
    .then(redirectToAuthorize);

export const POST = async (req: NextRequest) =>
  setRedirectToFromBody(req)
    .then(getParam("handle")("body"))
    .then(redirectToAuthorize);
