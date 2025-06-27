import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function LinkToLists() {
  return (
    <Link
      href="https://bsky.app/lists"
      className="flex gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs border"
    >
      <PlusIcon className="size-4" /> 리스트 만들고 오기
    </Link>
  );
}
