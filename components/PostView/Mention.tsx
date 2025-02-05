import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import PostForm from "../PostForm";

export default function Mention({
  count,
  uri,
}: {
  count: number;
  uri: string;
}) {
  return (
    <Dialog>
      <DialogTrigger className="flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground">
        <MessageSquare /> {count > 0 ? count : ""}
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
