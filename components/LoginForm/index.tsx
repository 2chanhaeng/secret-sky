"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getProfile } from "@/lib/api";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import Spinner from "@/components/Spinner";
import { DOMAIN_REGEX } from "@/lib/const";
import { isStr } from "@/lib/pred";

const formSchema = z.object({
  handle: z.string().regex(DOMAIN_REGEX, "핸들은 도메인 형식이어야 합니다."),
  redirectTo: z.string().optional(),
});
type FormSchema = z.infer<typeof formSchema>;

export default function LoginForm({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { redirectTo, handle: "" },
    reValidateMode: "onSubmit",
  });
  const [handle, setHandle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteProfile } = useProfile();
  const errors = getError(form.formState.errors.handle);

  useEffect(() => {
    if (form.formState.isSubmitting)
      setIsSubmitting(form.formState.isSubmitting);
    if (errors) setIsSubmitting(false);
  }, [form.formState.isSubmitting, errors]);

  const setError = (message: string) => {
    form.setError("handle", { message });
    setIsSubmitting(false);
  };
  const onSubmit = onSubmitWhenError(deleteProfile, setError);
  const submit = form.handleSubmit(onSubmit);
  form.setValue("redirectTo", redirectTo);

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.setValue("handle", handle);
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <Input
        type="text"
        {...form.register("handle")}
        autoComplete="handle"
        placeholder="Handle"
        className="text-2xl"
        onKeyDown={onKeyDown}
        onChange={(e) => {
          form.clearErrors("handle");
          setHandle(e.target.value);
        }}
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
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-foreground text-background font-bold"
      >
        {isSubmitting && <Spinner />}
        Login
      </Button>
    </form>
  );
}

const onSubmitWhenError =
  (deleteProfile: () => void, setError: (message: string) => void) =>
  async ({ handle: raw, redirectTo }: FormSchema) => {
    const handle = raw.toLowerCase().replace(/[@\s]/g, "");
    const res = await getProfile(handle);
    if ("error" in res)
      return setError("핸들에 문제가 있습니다. 다시 확인해주세요.");
    deleteProfile();
    redirect(`/auth?handle=${handle}&redirectTo=${redirectTo}`);
  };
const getError = (error: undefined | FieldError) =>
  error ? (isStr(error) ? error : error?.message) : undefined;
