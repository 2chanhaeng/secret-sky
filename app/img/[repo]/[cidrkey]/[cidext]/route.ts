import { NextRequest } from "next/server";

const CDN_URL = "https://cdn.bsky.app/img/feed_fullsize/plain";
const EXAM_KEY = [
  154,
  138,
  84,
  2,
  108,
  177,
  238,
  50,
  255,
  132,
  182,
  90,
  70,
  176,
  127,
  131,
  206,
  148,
  223,
  227,
  15,
  233,
  203,
  95,
  113,
  73,
  204,
  240,
  186,
  213,
  201,
  61,
];
const EXAM_IV = [
  186,
  46,
  123,
  80,
  8,
  218,
  238,
  199,
  214,
  60,
  225,
  252,
  59,
  124,
  132,
  20,
];

export const GET = async (_: NextRequest, { params }: {
  params: Promise<{
    repo: string;
    cidrkey: string;
    cidext: string;
  }>;
}) => {
  const { repo, cidrkey: rkey, cidext } = await params;
  console.log({ repo, rkey, cidext }, generateAESKey());
  const [cid, ext] = cidext.split(".");
  const url = `${CDN_URL}/${repo}/${cid}@${ext}`;
  const image = await (await fetch(url)).blob();
  const key = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(EXAM_KEY),
    "AES-CBC",
    false,
    ["encrypt"],
  );
  const iv = new Uint8Array(EXAM_IV);
  const { encrypted } = await encryptBlob(image, key, iv);
  return new Response(encrypted, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
};

async function encryptBlob(
  blob: Blob,
  key: CryptoKey,
  _iv?: Uint8Array<ArrayBuffer>,
): Promise<{ encrypted: Blob; iv: Uint8Array }> {
  const iv = _iv ?? crypto.getRandomValues(new Uint8Array(16)); // 16바이트 IV 생성
  const algorithm = { name: "AES-CBC", iv };

  const buffer = await blob.arrayBuffer();
  const encryptedBuffer = await crypto.subtle.encrypt(algorithm, key, buffer);

  return {
    encrypted: new Blob([encryptedBuffer]),
    iv,
  };
}
async function generateAESKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: "AES-CBC", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}
