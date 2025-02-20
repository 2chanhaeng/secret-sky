"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Viewer } from "@/types/bsky";
import { getPosts } from "@/lib/api";
import { isPostView } from "@/lib/pred";
import { VariantProps } from "class-variance-authority";

export default function Like({
  uri,
  count: initialCount = 0,
  viewer,
  size = "sm",
  iconSize = 16,
  className,
}: {
  uri: string;
  viewer?: Viewer;
  count?: number;
  size?: VariantProps<typeof buttonVariants>["size"];
  iconSize?: number;
  className?: string;
}) {
  const [liked, setLiked] = useState(!!viewer?.like);
  const [count, setCount] = useState(initialCount);

  if (!viewer || viewer.replyDisabled) return null;

  const handleClick = () => {
    setCount((prev) => prev + (liked ? -1 : 1));
    setLiked((prev) => !prev);
    toggleLike(uri)
      .then(setLiked)
      .then(() => getPosts([uri]))
      .then(
        ({ posts: [post] }) => isPostView(post) && setCount(post.likeCount ?? 0)
      );
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(className, { "text-red-500": liked })}
      variant="ghost"
      size={size}
    >
      <Heart fill={liked ? "currentColor" : "transparent"} size={iconSize} />
      {count > 0 ? ` ${count}` : ""}
    </Button>
  );
}

const toggleLike = async (
  uri: string //
) => fetch(`/api/like?uri=${uri}`).then((res) => res.json());
