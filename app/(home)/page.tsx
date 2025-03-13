"use client";

import { useProfile } from "@/hooks/use-profile";
import { useEffect } from "react";
import LoggedInPage from "./components/LoggedInHome";
import StartHome from "./components/StartHome";
import LoadingHome from "./components/LoadingHome";

export default function Home() {
  const { profile, fetched } = useLoggedIn();

  if (!fetched) return <LoadingHome />;
  if (!profile) return <StartHome />;
  return <LoggedInPage />;
}

const useLoggedIn = () => {
  const { profile, fetchProfile, fetched } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, fetched };
};
