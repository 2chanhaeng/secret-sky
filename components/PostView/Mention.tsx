"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import PostForm from "../PostForm";
import { Viewer } from "@/types/bsky";
import { buttonVariants } from "../ui/button";

export default function Mention({
  count = 0,
  viewer,
  uri,
  iconSize = 16,
}: {
  count?: number;
  viewer?: Viewer;
  uri: string;
  iconSize: number;
}) {
  if (!viewer || viewer.replyDisabled) return null;
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "ghost" })}>
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
