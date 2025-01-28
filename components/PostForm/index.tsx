import Form from "next/form";
import { post } from "@/actions/post";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AuthorAvatar, { AuthorAvatarProps } from "@/components/AuthorAvatar";

export default function PostForm({
  author,
  parent,
  className,
}: {
  author: AuthorAvatarProps;
  parent?: { uri: string; list: string };
  className?: string;
}) {
  return (
    <section className={`flex gap-2 ${className}`}>
      <AuthorAvatar {...author} className="size-12" />
      <Form action={post} className="flex flex-col ml-2 gap-2 w-full">
        <Textarea
          name="open"
          placeholder="공개적으로 적을 내용을 적어주세요."
        />
        <Textarea
          name="content"
          placeholder="비공개적으로 작성할 내용을 적어주세요."
        />
        {parent && <input type="hidden" name="parent" value={parent.uri} />}
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
