import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Form from "next/form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;

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
