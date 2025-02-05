import Form from "next/form";
import { post } from "@/actions/post";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AuthorAvatar from "@/components/AuthorAvatar";
import { FOLLOWING_RULE } from "@/types/threadgate";
import { cookies } from "next/headers";
import { BaseProfile } from "@/types/profile";

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
        <Textarea
          name="open"
          placeholder="공개적으로 적을 내용을 적어주세요."
        />
        <Textarea
          name="content"
          placeholder="비공개적으로 작성할 내용을 적어주세요."
        />
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
