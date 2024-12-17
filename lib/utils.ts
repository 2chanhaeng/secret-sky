import { NextRequest } from "next/server";

export type GetParamFrom = "search" | "body";
export const getParam: //
  (key: string) => //
  (where: GetParamFrom) => //
  (req: NextRequest) => Promise<string | null> =
    (key) => (where) => async (req) =>
      where === "body"
        ? ((await req.json())[key] ?? null)
        : req.nextUrl.searchParams.get(key);
