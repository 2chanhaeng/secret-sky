import { NextRequest } from "next/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BlobRef } from "@atproto/api";
import { BSKY_CDN_IMAGE_PATH } from "./const";
import { isStr } from "./pred";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export type GetParamFrom = "search" | "body";
export const getParam: //
  (key: string) => //
  (where: GetParamFrom) => //
  (req: NextRequest) => Promise<string | null> =
    (key) => (where) => async (req) =>
      where === "body"
        ? (await req.json())[key] ?? null
        : req.nextUrl.searchParams.get(key);

export const getByteLength = (str: string) =>
  new TextEncoder().encode(str).length;

export const blobRefToUrl = (repo: string, blobRef: BlobRef | string) => {
  if (isStr(blobRef)) return blobRef;
  const cid = blobRef.ref?.$link ?? blobRef.ref.toString();

  return `${BSKY_CDN_IMAGE_PATH}/${repo}/${cid}@webp`;
};

export const safeNumber = (
  n: unknown,
  or: number = 0,
) => (typeof n === "number" && !isNaN(n) ? n : or);

export const regulateAspectRatio = (
  props: {
    width: number;
    height: number;
  } | undefined,
) => {
  if (!props) return { width: 1920, height: 1080 };
  const { width, height } = props;
  const aspectRatio = safeNumber(width / height, 1);
  if (aspectRatio > 1) {
    return { width: 1920, height: 1080 / aspectRatio };
  } else {
    return { width: 1920 * aspectRatio, height: 1080 };
  }
};

export const removeSuffixLink = (text: string) =>
  text.replace(/\n*비밀글 보기$/, "");

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
