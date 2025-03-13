import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StartHome() {
  return (
    <main className="h-full flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold pb-8">Secret Sky</h1>
      <p className="w-[300px] text-center break-keep">
        <span className="text-3xl font-bold block">내 글은 내 블친에게만!</span>
        <br />
        <span className="font-bold">Secret Sky</span>는 Bluesky에
        <br />
        비밀글을 작성할 수 있는
        <br />
        Third-party 클라이언트입니다.
      </p>
      <Link href="/auth/login" className="w-full text-center fixed bottom-8">
        <Button className="w-full max-w-md p-4 text-xl">로그인</Button>
      </Link>
    </main>
  );
}
