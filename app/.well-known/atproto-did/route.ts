import { OFFICIAL_ACCOUNT_DID } from "@/lib/const";

export const dynamic = "force-static";

export const GET = async () => new Response(OFFICIAL_ACCOUNT_DID);
