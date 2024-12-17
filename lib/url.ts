import { HttpsUri } from "@atproto/oauth-client-node";

export const PUBLIC_URL: HttpsUri | undefined //
 = process.env.NEXT_PUBLIC_URL as HttpsUri | undefined;
export const LOCAL_URL = "http://127.0.0.1:3000";
export const URL_BASE = PUBLIC_URL ?? LOCAL_URL;
export const CALLBACK_PATH = "/auth/callback/atproto";
export const CALLBACK_URL = `${URL_BASE}${CALLBACK_PATH}` as const;
