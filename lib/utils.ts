import { NextRequest } from "next/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
