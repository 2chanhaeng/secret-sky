import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useTimeline } from "@/context/timeline";
import { useFeedInfos } from "@/hooks/use-feed-infos";

export default function NavigationFeedDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const feeds = useFeedInfos();
  const timeline = useTimeline();

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>피드</DrawerTitle>
          <DrawerDescription className="flex flex-col divide-y border rounded-md max-h-[80svh] overflow-y-scroll">
            {feeds.map((feed) => (
              <button
                key={feed.uri}
                onClick={() => {
                  setOpen(false);
                  timeline.feed = feed;
                }}
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
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
