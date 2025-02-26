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
    const charStart = getCharIndexFromByteIndex(text, byteStart);
    const charEnd = getCharIndexFromByteIndex(text, byteEnd);

    // 현재 인덱스부터 링크 시작 전까지 일반 텍스트 추가
    if (currentIndex < charStart) {
      elements.push(text.slice(currentIndex, charStart));
    }
    // 링크 부분의 텍스트
    const linkText = text.slice(charStart, charEnd);
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

const getCharIndexFromByteIndex = (text: string, byteIndex: number): number => {
  const encoder = new TextEncoder();
  let cumulativeByteCount = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const encodedChar = encoder.encode(char);
    // 만약 다음 문자를 포함하면 byteIndex가 이 문자 내에 존재함
    if (cumulativeByteCount + encodedChar.length > byteIndex) {
      return i;
    }
    cumulativeByteCount += encodedChar.length;
  }
  return text.length;
};
