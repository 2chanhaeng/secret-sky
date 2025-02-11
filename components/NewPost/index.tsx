import { SquarePen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PostForm from "../PostForm";

export default function NewPost() {
  return (
    <Dialog>
      <DialogTrigger className="sticky bottom-4 right-4 float-right p-4 bg-blue-500 text-white rounded-full">
        <SquarePen />
      </DialogTrigger>
      <DialogContent className="max-h-[100svh]">
        <DialogHeader>
          <DialogTitle>새 글 작성하기</DialogTitle>
        </DialogHeader>
        <PostForm />
      </DialogContent>
    </Dialog>
  );
}
