import { BSKY_CDN_IMAGE_PATH } from "@/lib/const";
import { NextRequest } from "next/server";

export const dynamic = "force-static";

export const GET = async (_: NextRequest, { params }: {
  params: Promise<{
    repo: string;
    cidrkey: string;
  }>;
}) =>
  params.then(
    ({ repo, cidrkey }) => ({
      repo,
      cid: cidrkey.split(".")[0],
      ext: cidrkey.split(".")[1],
    }),
  ) //
    .then(({ repo, cid, ext }) =>
      `${BSKY_CDN_IMAGE_PATH}/${repo}/${cid}@${ext}`
    )
    .then((url) => fetch(url))
    .then((res) => res.blob())
    .then(blobToResponse);

const blobToResponse = (blob: Blob) =>
  new Response(blob, { headers: { "Content-Type": blob.type } });
