import ImageView from "./ImageView";

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
    </>
  );
}
