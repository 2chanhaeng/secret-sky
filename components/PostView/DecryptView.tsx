"use client";

import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function DecryptView({
  uri,
  sub = false,
}: {
  uri: string;
  sub?: boolean;
}) {
  const [decrypted, setDecrypted] = useState<string>("");

  useEffect(() => {
    const fetchDecrypted = async () => {
      const res = await fetch(`/api/decrypt?uri=${uri}`);
      const decrypted = await res.json();
      console.log(decrypted);
      setDecrypted(decrypted);
    };
    fetchDecrypted();
  });

  if (!decrypted) return null;
  return (
    <div
      className={cn(
        "relative m-2 mt-4 pt-4 py-2 px-4 border-2 border-foreground/20 bg-foreground/10 rounded-xl",
        {
          "text-2xl": !sub,
          "text-base ml-0": sub,
        }
      )}
    >
      <span
        className={cn(
          "absolute left-2 -top-4 py-1 pl-2 pr-3 text-foreground/60 rounded-full bg-gray-300 dark:bg-gray-700",
          {
            "text-base": !sub,
            "text-sm": sub,
          }
        )}
      >
        <Lock className="inline w-4 h-4 mr-1" /> 비밀글
      </span>
      <p className="mt-2">{decrypted}</p>
    </div>
  );
}
