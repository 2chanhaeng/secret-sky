import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { uriToPath } from "@/lib/uri";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LinkToBskyApp({
  uri,
  size = "sm",
  iconSize = 16,
  className,
}: {
  uri: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  iconSize: number;
  className?: string;
}) {
  const path = uriToPath(uri);
  return (
    <Link
      href={`https://bsky.app${path}`}
      className={cn(buttonVariants({ variant: "ghost", size }), className)}
    >
      <ExternalLink className="inline" size={iconSize} />
    </Link>
  );
}
