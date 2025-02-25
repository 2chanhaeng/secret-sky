import { Facet, Mention, Link, Tag, ByteSlice } from "@/types/bsky";
import { isLink, isMention, isTag } from "@/lib/pred";
import Anchor from "next/link";

interface PostTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  facets?: Facet[];
}

const isFacet = (v: unknown): v is (Mention | Link | Tag) & ByteSlice =>
  isMention(v) || isLink(v) || isTag(v);

export default function PostText({
  text,
  facets = [],
  ...props
}: PostTextProps) {
  const links = facets //
    .map(({ features, index }) => ({ ...features[0], ...index })) //
    .filter(isFacet)
    .sort((a, b) => a.byteStart - b.byteStart); //
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;
  links.forEach(({ uri, did, tag, byteStart, byteEnd }) => {
    // 현재 인덱스부터 링크 시작 전까지 일반 텍스트 추가
    if (currentIndex < byteStart) {
      elements.push(text.slice(currentIndex, byteStart));
    }
    // 링크 부분의 텍스트
    const linkText = text.slice(byteStart, byteEnd);
    const href = did
      ? `/profile/${did}`
      : tag
      ? `/hashtag/${tag}`
      : (uri as string);
    elements.push(
      <Anchor key={href} href={href} className="text-blue-500">
        {linkText}
      </Anchor>
    );
    currentIndex = byteEnd;
  });

  // 마지막 링크 이후 남은 텍스트 추가
  if (currentIndex < text.length) {
    elements.push(text.slice(currentIndex));
  }
  return <p {...props}>{elements}</p>;
}
