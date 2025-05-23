import NewPost from "@/components/NewPost";
import Timeline from "../Timeline";
import { TimelineProvider, useFeedStore } from "@/context/timeline";
import BottomNavigation from "@/components/BottomNavigation";

export default function TimelineHome() {
  const timeline = useFeedStore();
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
