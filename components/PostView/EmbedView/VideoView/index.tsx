import { BSKY_VIDEO_CDN_PATH } from "@/lib/const";
import { isVideoEmbed, isVideoView } from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";
import { VideoViewType } from "@/types/bsky";
import Player from "./Player";

export default function VideoView({
  uri,
  embed,
}: {
  uri: string;
  embed: unknown;
}) {
  const [repo] = parseAtUri(uri);
  const video = extractVideoView(repo, embed);
  if (!video) return null;
  return (
    <section className="rounded-lg overflow-hidden h-fit max-h-[80vh] min-h-24 w-full object-center">
      <figure>
        <Player {...video} />
        {video.alt && <figcaption>{video.alt}</figcaption>}
      </figure>
    </section>
  );
}

const extractVideoView = (
  repo: string,
  embed: unknown
): VideoViewType | null => {
  if (isVideoView(embed)) return embed;
  if (isVideoEmbed(embed)) {
    const { aspectRatio, alt, video } = embed;
    const cid = video.ref.toString();
    const thumbnail = `${BSKY_VIDEO_CDN_PATH}/${repo}/${cid}/thumbnail.jpg`;
    const playlist = `${BSKY_VIDEO_CDN_PATH}/${repo}/${cid}/playlist.m3u8`;
    return {
      aspectRatio,
      alt,
      cid,
      playlist,
      thumbnail,
    };
  }
  return null;
};
