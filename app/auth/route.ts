import client from "@/lib/client";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const getHandleFromSearchParam = (req: NextRequest) =>
  req.nextUrl.searchParams.get("handle");
const getHandleFromBody = (req: NextRequest) =>
  req.json().then(({ handle }) => handle);

const getAuthURL = (handle: string) =>
  client.authorize(handle, { ui_locales: "en" });

const redirectToAuthorize = async (handle?: string | null) =>
  handle
    ? getAuthURL(handle)
      .then(({ href }) => href)
      .then(redirect)
    : redirect("/auth/login");

export const GET = async (req: NextRequest) =>
  redirectToAuthorize(getHandleFromSearchParam(req));

export const POST = async (req: NextRequest) =>
  getHandleFromBody(req).then(redirectToAuthorize);
