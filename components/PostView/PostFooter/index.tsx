import Mention from "./Mention";
import Like from "./Like";
import LinkToBskyApp from "./LinkToBsky";
import { PostViewType } from "@/types/bsky";

export default function PostFooter({
  uri,
  viewer,
  replyCount,
  likeCount,
  className = "",
  iconSize = 16,
  buttonsClassName: _buttonsClassName,
}: PostViewType & {
  className?: string;
  iconSize?: number;
  buttonsClassName?: string;
}) {
  const buttonsClassName = `h-6 ${_buttonsClassName}`;
  return (
    <section
      className={`text-foreground/60 text-xs flex justify-between has-[>:only-child]:justify-end ${className}`}
    >
      <Mention
        count={replyCount}
        uri={uri}
        viewer={viewer}
        iconSize={iconSize}
        className={buttonsClassName}
      />
      <Like
        uri={uri}
        count={likeCount}
        viewer={viewer}
        iconSize={iconSize}
        className={buttonsClassName}
      />
      <LinkToBskyApp
        uri={uri}
        iconSize={iconSize}
        className={buttonsClassName}
      />
    </section>
  );
}
