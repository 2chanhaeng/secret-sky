"use client";

import { isEncryptedEmbed } from "@/lib/pred";
import { HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { uriToPath } from "@/lib/uri";
import Link, { LinkProps } from "next/link";

export default function DecryptView({
  uri,
  embed,
  sub = false,
}: {
  uri: string;
  embed: unknown;
  sub?: boolean;
}) {
  const decrypted = useDecrypted(uri, embed);
  const path = uriToPath(uri);

  if (!decrypted) return null;

  return (
    <Container
      sub={sub}
      href={path}
      className={cn(
        "relative m-2 mt-4 pt-4 py-2 px-4 border-2 border-foreground/20 bg-foreground/10 rounded-xl",
        {
          "text-2xl": !sub,
          "text-base mx-0 mb-0": sub,
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
      <p className="mt-2 line-clamp-5">{decrypted}</p>
    </Container>
  );
}

type ContainerProps =
  | ({
      sub: true;
    } & LinkProps)
  | ({ sub: false } & HTMLAttributes<HTMLDivElement>);

function Container({ sub, ...props }: ContainerProps) {
  if (sub) return <Link {...(props as LinkProps)} />;
  return <div {...(props as HTMLAttributes<HTMLDivElement>)} />;
}

const useDecrypted = (uri: string, embed: unknown) => {
  const [decrypted, setDecrypted] = useState<string>("");

  useEffect(() => {
    if (!isEncryptedEmbed(embed)) return;
    const fetchDecrypted = async () => {
      const res = await fetch(`/api/decrypt?uri=${uri}`);
      const decrypted = await res.json();
      setDecrypted(decrypted);
    };
    fetchDecrypted();
  });

  return decrypted;
};
