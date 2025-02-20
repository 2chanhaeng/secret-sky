import {
  isRecordEmbed,
  isRecordView,
  isRecordWithMediaEmbed,
  isRecordWithMediaView,
} from "@/lib/pred";
import QuotedPostView from "./QuotedPostView";
import { ViewRecord } from "@/types/bsky";
import AsyncQuotedPostView from "./AsyncQuotedPostView";

export default function QuoteView({ embed }: { uri: string; embed: unknown }) {
  if (isRecordView(embed))
    return <QuotedPostView post={embed.record as ViewRecord} />;
  else if (isRecordWithMediaView(embed))
    return <QuotedPostView post={embed.record.record as ViewRecord} />;
  else if (isRecordEmbed(embed))
    return <AsyncQuotedPostView uri={embed.record.uri} />;
  else if (isRecordWithMediaEmbed(embed))
    return <AsyncQuotedPostView uri={embed.record.record.uri} />;
  return null;
}
