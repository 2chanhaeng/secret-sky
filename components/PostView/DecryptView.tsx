import { decrypt } from "@/lib/aes";
import { isEncryptedFacet } from "@/lib/pred";
import { cn } from "@/lib/utils";
import prisma from "@/prisma";
import { Viewer } from "@/types/bsky";
import { Facet } from "@atproto/api";
import { Lock } from "lucide-react";

export default async function DecryptView({
  facets,
  viewer,
  uri,
  sub = false,
}: {
  facets: Facet[];
  viewer?: Viewer;
  uri: string;
  sub?: boolean;
}) {
  if (!viewer || viewer.replyDisabled) return null;
  const encryptedValue = facets
    .map((facet) => facet.features || [])
    .flat()
    .find(isEncryptedFacet);
  if (!encryptedValue || !isEncryptedFacet(encryptedValue)) return null;
  const { encrypted } = encryptedValue;
  const { key, iv } = await prisma.post.findUniqueOrThrow({ where: { uri } });
  const decrypted = await decrypt(encrypted, key, iv);
  return (
    <p
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
      {decrypted}
    </p>
  );
}
