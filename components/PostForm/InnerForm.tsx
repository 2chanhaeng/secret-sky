"use client";

import { post } from "@/actions/post";
import { Button } from "@/components/ui/button";
import { FOLLOWING_RULE } from "@/types/threadgate";
import { Lock } from "lucide-react";
import { useActionState } from "react";
import Form from "next/form";
import Textarea from "../Textarea";

const INITIAL_STATE = {
  message: "",
  open: "",
  content: "",
} as const;

export default function InnerForm({ parent }: { parent?: string }) {
  const [state, formAction, pending] = useActionState(post, INITIAL_STATE);

  return (
    <Form action={formAction} className="flex flex-col ml-2 gap-2 w-full">
      <section className="rounded-lg p-2 border border-foreground/20 max-h-[calc(80svh-10rem)] overflow-y-scroll">
        <Textarea
          name="open"
          placeholder="무슨 일이 일어나고 있나요?"
          defaultValue={state?.open ?? ""}
          maxLength={250}
        />
        <div className="relative m-2 mt-4 pt-4 py-2 px-4 border-2 border-foreground/20 bg-foreground/10 rounded-xl">
          <span className="absolute left-2 -top-4 py-1 pl-2 pr-3 text-foreground/60 rounded-full bg-gray-300 dark:bg-gray-700">
            <Lock className="inline w-4 h-4 mr-1" /> 비밀글
          </span>
          <Textarea
            name="content"
            defaultValue={state?.content ?? ""}
            className="mt-2 w-full"
            placeholder="비밀글"
            maxLength={1000}
          />
        </div>
      </section>
      {!parent && (
        <input type="hidden" name="allow" value={FOLLOWING_RULE} readOnly />
      )}
      {parent && <input type="hidden" name="parent" value={parent} readOnly />}
      {state?.message && <div className="text-red-500">{state?.message}</div>}
      <Button
        type="submit"
        className="bg-foreground text-background font-bold"
        disabled={pending}
      >
        작성하기
      </Button>
    </Form>
  );
}
