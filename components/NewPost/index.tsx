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
      <DialogTrigger className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full">
        <SquarePen />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <PostForm />
      </DialogContent>
    </Dialog>
  );
}
