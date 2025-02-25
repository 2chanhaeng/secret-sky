import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import LoggedAccounts from "@/components/LoggedAccounts";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const { redirectTo } = await searchParams;
  return (
    <main>
      <Card className="mt-20">
        <CardHeader className="text-center text-2xl">Login</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoggedAccounts />
          <LoginForm redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </main>
  );
}
