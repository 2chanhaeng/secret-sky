"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Repeat2 } from "lucide-react";
import { Viewer } from "@/types/bsky";
import { getPosts } from "@/lib/api";
import { isPostView } from "@/lib/pred";
import { VariantProps } from "class-variance-authority";

export default function Repost({
  uri,
  count: initialCount = 0,
  viewer,
  size = "sm",
  iconSize = 18,
  className,
}: {
  uri: string;
  viewer?: Viewer;
  count?: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  iconSize?: number;
  className?: string;
}) {
  const [reposted, setReposted] = useState(!!viewer?.repost);
  const [count, setCount] = useState(initialCount);

  if (!viewer || viewer.embeddingDisabled) return null;

  const handleClick = () => {
    setCount((prev) => prev + (reposted ? -1 : 1));
    setReposted((prev) => !prev);
    toggleRepost(uri)
      .then(setReposted)
      .then(() => getPosts([uri]))
      .then(
        ({ posts: [post] }) =>
          isPostView(post) && setCount(post.repostCount ?? 0)
      );
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(className, { "text-green-600": reposted })}
      variant="ghost"
      size={size}
    >
      <Repeat2 size={iconSize} strokeWidth={reposted ? 3 : 2} />
      {count > 0 ? ` ${count}` : ""}
    </Button>
  );
}

const toggleRepost = async (
  uri: string //
) => fetch(`/api/repost?uri=${uri}`).then((res) => res.json());
