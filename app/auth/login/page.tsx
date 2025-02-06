import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "./components/LoginForm";

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
          <LoginForm redirectTo={redirectTo} />
        </CardContent>
      </Card>
    </main>
  );
}
