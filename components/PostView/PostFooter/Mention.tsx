"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import PostForm from "@/components/PostForm";
import { Viewer } from "@/types/bsky";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export default function Mention({
  count = 0,
  viewer,
  uri,
  size = "sm",
  iconSize = 16,
  className,
}: {
  count?: number;
  viewer?: Viewer;
  uri: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  iconSize: number;
  className?: string;
}) {
  if (!viewer || viewer.replyDisabled) return null;
  return (
    <Dialog>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "ghost", size }), className)}
      >
        <MessageSquare size={iconSize} /> {count > 0 ? count : ""}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>멘션 작성하기</DialogTitle>
        </DialogHeader>
        <PostForm parent={uri} />
      </DialogContent>
    </Dialog>
  );
}
