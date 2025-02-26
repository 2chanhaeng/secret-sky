"use client";

import AuthorAvatar from "@/components/AuthorAvatar";
import InnerForm from "./InnerForm";
import { useProfile } from "@/hooks/use-profile";

export default function PostForm({
  parent,
  className = "",
}: {
  parent?: string;
  className?: string;
}) {
  return (
    <section className={`flex gap-2 ${className}`}>
      <Author />
      <InnerForm parent={parent} />
    </section>
  );
}

function Author() {
  const { profile } = useProfile();
  if (!profile) return null;
  return <AuthorAvatar {...profile} className="size-12" />;
}
