import { NextRequest } from "next/server";
import client from "@/lib/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const cookie = await cookies();

  const { session: { sub } } = await client.callback(params);
  cookie.set("did", sub);
  const redirectTo = cookie.get("redirectTo")?.value ?? "/";
  cookie.delete("redirectTo");
  return redirect(redirectTo);
};
