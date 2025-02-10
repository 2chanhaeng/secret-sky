import { getCurrentProfile } from "@/lib/profile";
import Link from "next/link";
import NavigationProfile from "./NavigationProfile";
import NavigationFeed from "./NavigationFeed";

export default async function BottomNavigation() {
  const profile = await getCurrentProfile();
  if (!profile) return <NotLoggedInNavigation />;
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center border-t border-foreground/40 bg-background p-2">
      <NavigationFeed />
      <NavigationProfile {...profile} />
    </nav>
  );
}

function NotLoggedInNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center border-t border-foreground/40 bg-background p-2">
      <Link href="/auth/login" className="text-foreground/80">
        Login
      </Link>
    </nav>
  );
}
