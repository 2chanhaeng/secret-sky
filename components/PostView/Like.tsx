"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Viewer } from "@/types/bsky";
import { getPostThread } from "@/lib/api";
import { isPostView, isThreadViewPost } from "@/lib/pred";

export default function Like({
  uri,
  count: initialCount = 0,
  viewer,
  iconSize = 16,
}: {
  uri: string;
  viewer?: Viewer;
  count?: number;
  iconSize?: number;
}) {
  const [liked, setLiked] = useState(!!viewer?.like);
  const [count, setCount] = useState(initialCount);

  if (!viewer || viewer.replyDisabled) return null;

  const handleClick = () => {
    setCount((prev) => prev + (liked ? -1 : 1));
    setLiked((prev) => !prev);
    toggleLike(uri)
      .then(setLiked)
      .then(() => getPostThread(uri))
      .then(
        ({ thread }) =>
          isThreadViewPost(thread) && setCount(thread.post.likeCount ?? 0)
      );
  };

  return (
    <Button
      onClick={handleClick}
      className={cn({ "text-red-500": liked })}
      variant="ghost"
    >
      <Heart fill={liked ? "currentColor" : "transparent"} size={iconSize} />
      {count > 0 ? ` ${count}` : ""}
    </Button>
  );
}

const toggleLike = async (
  uri: string //
) => fetch(`/api/like?uri=${uri}`).then((res) => res.json());
