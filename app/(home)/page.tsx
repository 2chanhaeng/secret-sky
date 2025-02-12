"use client";

import NewPost from "@/components/NewPost";
import Timeline from "./components/Timeline";
import { TimelineProvider, FeedStore } from "@/context/timeline";
import BottomNavigation from "@/components/BottomNavigation";

export default function Home() {
  const timeline = new FeedStore();
  return (
    <TimelineProvider value={timeline}>
      <main className="h-full">
        <Timeline />
        <NewPost />
      </main>
      <BottomNavigation />
    </TimelineProvider>
  );
}
