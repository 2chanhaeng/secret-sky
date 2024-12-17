import Form from "next/form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <main>
      <Form action="/auth">
        <input type="text" name="handle" autoComplete="handle" />
        <input type="hidden" name="redirectTo" value={redirect ?? "/"} />
        <button type="submit">Login</button>
      </Form>
    </main>
  );
}
