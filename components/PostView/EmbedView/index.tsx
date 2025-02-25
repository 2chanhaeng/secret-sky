import ExceptQuoteView from "./ExceptQuoteView";
import QuoteView from "./QuoteView";

export default function EmbedView({
  uri,
  embed,
  sub,
}: {
  uri: string;
  embed: unknown;
  sub?: boolean;
  quoted?: boolean;
}) {
  return (
    <>
      <ExceptQuoteView uri={uri} embed={embed} sub={sub} />
      <QuoteView uri={uri} embed={embed} sub={sub} />
    </>
  );
}
