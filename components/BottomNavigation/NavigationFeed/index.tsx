"use client";

import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import React, { useState } from "react";
import NavigationFeedDrawer from "./Feeds";
import { useTimeline } from "@/context/timeline";

interface MouseCoords {
  x: number;
  y: number;
}

const INITIAL_COORDS: MouseCoords = { x: -1, y: -1 } as const;

export default function NavigationFeed() {
  const [startTime, setStartTime] = useState(-1);
  const [startCoords, setStartCoords] = useState(INITIAL_COORDS);
  const [open, setOpen] = useState(false);
  const { init } = useTimeline();

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
      if (window.location.pathname === "/") {
        init();
        const behavior = window.scrollY > 2000 ? "smooth" : "auto";
        document.querySelector("main")?.scrollTo({ top: 0, behavior });
      } else {
        window.location.href = "/";
      }
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
