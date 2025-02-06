import Form from "next/form";
import { post } from "@/actions/post";
import { Button } from "@/components/ui/button";
import AuthorAvatar from "@/components/AuthorAvatar";
import { FOLLOWING_RULE } from "@/types/threadgate";
import { cookies } from "next/headers";
import { BaseProfile } from "@/types/profile";
import { Lock } from "lucide-react";

export default function PostForm({
  parent,
  className,
}: {
  parent?: string;
  className?: string;
}) {
  return (
    <section className={`flex gap-2 ${className}`}>
      <Author />
      <Form action={post} className="flex flex-col ml-2 gap-2 w-full">
        <section className="flex flex-col gap-2 rounded-lg p-2 border border-foreground/20">
          <textarea name="open" placeholder="무슨 일이 일어나고 있나요?" />

          <div className="relative m-2 mt-4 pt-4 py-2 px-4 border-2 border-foreground/20 bg-foreground/10 rounded-xl">
            <span className="absolute left-2 -top-4 py-1 pl-2 pr-3 text-foreground/60 rounded-full bg-gray-300 dark:bg-gray-700">
              <Lock className="inline w-4 h-4 mr-1" /> 비밀글
            </span>
            <textarea
              name="content"
              className="mt-2 w-full"
              placeholder="비밀글"
            />
          </div>
        </section>
        {!parent && <input type="hidden" name="allow" value={FOLLOWING_RULE} />}
        {parent && <input type="hidden" name="parent" value={parent} />}
        <Button
          type="submit"
          className="bg-foreground text-background font-bold"
        >
          작성하기
        </Button>
      </Form>
    </section>
  );
}

async function Author() {
  const cookie = await cookies();
  const profile: BaseProfile = JSON.parse(cookie.get("profile")?.value ?? "{}");
  return <AuthorAvatar {...profile} className="size-12" />;
}
