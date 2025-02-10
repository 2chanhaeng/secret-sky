"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useFeedInfos } from "@/hooks/db";
import { House } from "lucide-react";
import React, { useState } from "react";

interface MouseCoords {
  x: number;
  y: number;
}
const INITIAL_COORDS: MouseCoords = { x: -1, y: -1 } as const;

export default function NavigationFeed() {
  const [startTime, setStartTime] = useState(-1);
  const [startCoords, setStartCoords] = useState(INITIAL_COORDS);
  const [open, setOpen] = useState(false);

  const LONG_PRESS_THRESHOLD = 1000;
  const DRAG_THRESHOLD = 20;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setStartTime(Date.now());
    setStartCoords({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    const elapsed = Date.now() - startTime;
    const dy = startCoords.y - e.clientY;

    if (dy > DRAG_THRESHOLD || elapsed >= LONG_PRESS_THRESHOLD) {
      setOpen(true);
    } else {
      const behavior = window.scrollY > 2000 ? "smooth" : "auto";
      window.scrollTo({ top: 0, behavior });
    }

    setStartTime(-1);
    setStartCoords(INITIAL_COORDS);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setStartTime(-1);
    setStartCoords(INITIAL_COORDS);
  };

  return (
    <Button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      variant="ghost"
      className="p-0 size-10"
    >
      <House size={28} strokeWidth={1} />
      <NavigationFeedDrawer open={open} setOpen={setOpen} />
    </Button>
  );
}

function NavigationFeedDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const feeds = useFeedInfos();

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>피드</DrawerTitle>
          <DrawerDescription>
            <div className="flex flex-col divide-y border rounded-md max-h-[80svh] overflow-y-scroll">
              {feeds.map((feed) => (
                <button
                  key={feed.uri}
                  className="py-2 px-4 flex items-center justify-start gap-2 min-h-12"
                >
                  {feed.avatar && (
                    <Avatar className="size-8 mr-2">
                      <AvatarImage src={feed.avatar} alt={feed.displayName} />
                      <AvatarFallback>{feed.displayName}</AvatarFallback>
                    </Avatar>
                  )}
                  <span className="font-bold text-foreground line-clamp-1">
                    {feed.displayName}
                  </span>
                </button>
              ))}
            </div>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
