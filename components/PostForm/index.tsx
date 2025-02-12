import AuthorAvatar from "@/components/AuthorAvatar";
import InnerForm from "./InnerForm";
import { getCurrentProfile } from "@/actions/profile";

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
  const profile = (await getCurrentProfile())!;
  return <AuthorAvatar {...profile} className="size-12" />;
}
