import {
  isRecordEmbed,
  isRecordView,
  isRecordWithMediaEmbed,
  isRecordWithMediaView,
} from "@/lib/pred";
import QuotedPostView from "./QuotedPostView";
import { ViewRecord } from "@/types/bsky";
import AsyncQuotedPostView from "./AsyncQuotedPostView";

export default function QuoteView({
  embed,
  sub,
}: {
  uri: string;
  embed: unknown;
  sub?: boolean;
}) {
  if (isRecordView(embed))
    return <QuotedPostView post={embed.record as ViewRecord} sub={sub} />;
  else if (isRecordWithMediaView(embed))
    return (
      <QuotedPostView post={embed.record.record as ViewRecord} sub={sub} />
    );
  else if (isRecordEmbed(embed))
    return <AsyncQuotedPostView uri={embed.record.uri} sub={sub} />;
  else if (isRecordWithMediaEmbed(embed))
    return <AsyncQuotedPostView uri={embed.record.record.uri} sub={sub} />;
  return null;
}
