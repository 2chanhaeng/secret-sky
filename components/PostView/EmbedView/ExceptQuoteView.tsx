import DecryptView from "./DecryptView";
import ExternalView from "./ExternalView";
import ImageView from "./ImageView";
import VideoView from "./VideoView";

export default function ExceptQuoteView({
  uri,
  embed,
  sub,
}: {
  uri: string;
  embed: unknown;
  sub?: boolean;
}) {
  return (
    <>
      <ImageView uri={uri} embed={embed} />
      <VideoView uri={uri} embed={embed} />
      <ExternalView uri={uri} embed={embed} />
      <DecryptView uri={uri} embed={embed} sub={sub} />
    </>
  );
}
