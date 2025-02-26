import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async () =>
  cookies()
    .then((cookie) => cookie.get("handle")?.value)
    .then((handle) =>
      redirect(handle ? `/auth?handle=${handle}` : "/auth/logout")
    );
