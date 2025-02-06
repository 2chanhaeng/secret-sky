import AuthorAvatar from "@/components/AuthorAvatar";
import { cookies } from "next/headers";
import { BaseProfile } from "@/types/profile";
import InnerForm from "./InnerForm";

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

async function Author() {
  const cookie = await cookies();
  const profile: BaseProfile = JSON.parse(cookie.get("profile")?.value ?? "{}");
  return <AuthorAvatar {...profile} className="size-12" />;
}
