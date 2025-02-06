"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getProfile } from "@/lib/api";
import { redirect } from "next/navigation";

const formSchema = z.object({
  handle: z
    .string()
    .regex(
      /^(?=.{1,253}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/,
      "핸들은 도메인 형식이어야 합니다. '.bsky.social' 까지 작성해주세요."
    ),
  redirectTo: z.string(),
});
type FormSchema = z.infer<typeof formSchema>;

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { redirectTo },
    reValidateMode: "onSubmit",
  });

  const onSubmit = async ({ handle: raw, redirectTo }: FormSchema) => {
    const handle = raw.toLowerCase().replace(/[@\s]/g, "");
    const res = await getProfile(handle);
    console.log(res);
    if ("error" in res) {
      form.setError("handle", {
        message: "핸들에 문제가 있습니다. 다시 확인해주세요.",
      });
      return;
    }
    redirect(`/auth?handle=${handle}&redirectTo=${redirectTo}`);
  };
  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };
  const errors =
    typeof form.formState.errors.handle === "string"
      ? form.formState.errors.handle
      : form.formState.errors.handle?.message;
  const handle = form.watch("handle", "");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <Input
        type="text"
        {...form.register("handle")}
        autoComplete="handle"
        placeholder="Handle"
        className="text-2xl"
        onKeyDown={onKeyDown}
        onChange={() => form.clearErrors("handle")}
      />
      {handle.length > 2 && handle.indexOf(".") === -1 && (
        <Button
          type="button"
          onClick={() => form.setValue("handle", handle + ".bsky.social")}
          className="text-sm"
        >
          <b>{handle}.bsky.social</b> 입력
        </Button>
      )}
      {errors && <p className="text-red-500 text-sm">{errors}</p>}
      <input
        type="hidden"
        value={redirectTo ?? "/"}
        readOnly
        {...form.register("redirectTo")}
      />
      <Button type="submit" className="bg-foreground text-background font-bold">
        Login
      </Button>
    </form>
  );
}
