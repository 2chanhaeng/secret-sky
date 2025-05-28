import { MarkdownHooks } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeStarryNight from "rehype-starry-night";

export default function MarkdownParser({ text }: { text: string }) {
  try {
    return (
      <MarkdownHooks
        rehypePlugins={[
          remarkGfm,
          rehypeRaw,
          remarkMath,
          rehypeKatex,
          rehypeStarryNight,
        ]}
      >
        {text}
      </MarkdownHooks>
    );
  } catch (error) {
    console.error("Error processing markdown:", error);
    return <>{text}</>;
  }
}
