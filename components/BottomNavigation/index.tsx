"use client";

import Link from "next/link";
import NavigationProfile from "./NavigationProfile";
import NavigationFeed from "./NavigationFeed";
import { useProfile } from "@/hooks/use-profile";
import { useEffect } from "react";

export default function BottomNavigation() {
  const { profile, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!profile) return <NotLoggedInNavigation />;
  return (
    <nav className="sticky bottom-0 w-full flex justify-around items-center border-t border-foreground/40 bg-background py-2 px-[calc(max(1rem,50vw-300px))]">
      <NavigationFeed />
      <NavigationProfile {...profile} />
    </nav>
  );
}

function NotLoggedInNavigation() {
  return (
    <nav className="sticky bottom-0 w-full flex justify-around items-center border-t border-foreground/40 bg-background p-2">
      <Link href="/auth/login" className="text-foreground/80">
        Login
      </Link>
    </nav>
  );
}
