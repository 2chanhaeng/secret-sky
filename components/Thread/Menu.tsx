import { Ellipsis, Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Menu() {
  return (
    <div className="flex gap-2 justify-stretch w-full">
        <Mention />
        <Button className="flex-1" variant="ghost">
          <Heart />
        </Button>
        <Button className="flex-1" variant="ghost">
          <Ellipsis />
        </Button>
      </div>
  )
}

function Mention() {
  return (
    <Dialog>
  <DialogTrigger>
    <Button className="flex-1" variant="ghost">
      <MessageSquare />
    </Button>
    </DialogTrigger>

    <DialogContent>
    <DialogHeader>
      <DialogTitle>멘션 작성하기</DialogTitle>

      
    </DialogHeader>
  </DialogContent>
    </Dialog>

  )
}