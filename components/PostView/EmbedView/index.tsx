import ExternalView from "./ExternalView";
import ImageView from "./ImageView";
import QuoteView from "./QuoteView";

export default function EmbedView({
  uri,
  embed,
}: {
  uri: string;
  embed: unknown;
}) {
  return (
    <>
      <ImageView uri={uri} embed={embed} />
      <ExternalView uri={uri} embed={embed} />
      <QuoteView uri={uri} embed={embed} />
    </>
  );
}
