import Spinner from "@/components/Spinner";

export default function LoadingHome() {
  return (
    <main className="h-full flex justify-center items-center">
      <Spinner className="w-1/6 h-1/6" />
    </main>
  );
}
