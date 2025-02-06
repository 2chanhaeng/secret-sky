import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Form from "next/form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const { redirectTo, error } = await searchParams;
  console.log({ error });

  return (
    <main>
      <Card>
        <CardHeader className="text-center text-2xl">Login</CardHeader>
        <CardContent>
          <Form action="/auth" className="flex flex-col gap-2">
            <Input
              type="text"
              name="handle"
              autoComplete="handle"
              placeholder="Handle"
              className="text-2xl"
            />
            {error && (
              <p className="text-red-500 text-center">
                핸들을 찾을 수 없습니다. 다시 시도해주세요.
              </p>
            )}
            <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
            <Button
              type="submit"
              className="bg-foreground text-background font-bold"
            >
              Login
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
