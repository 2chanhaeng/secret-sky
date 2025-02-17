import { isExternalEmbed } from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";
import { blobRefToUrl } from "@/lib/utils";
import { BlobRef } from "@atproto/api";
import Image from "next/image";
import Link from "next/link";

export default function ExternalView({
  uri,
  embed,
}: {
  uri: string;
  embed: unknown;
}) {
  if (!isExternalEmbed(embed)) return null;
  const {
    external: { description, title, uri: url, thumb },
  } = embed;
  const [repo] = parseAtUri(uri);
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <section className="rounded-lg overflow-hidden flex flex-col gap-1 border">
        <ExternalThumb repo={repo} thumb={thumb} alt={title} />
        <p className="p-2">
          <h3 className="font-bold">{title}</h3>
          <span className="text-sm/5 line-clamp-2 line text-foreground/60">
            {description}
          </span>
        </p>
      </section>
    </Link>
  );
}

function ExternalThumb({
  repo,
  thumb,
  alt,
}: {
  repo: string;
  thumb: BlobRef | undefined;
  alt: string;
}) {
  if (!thumb) return null;
  const thumbnail = blobRefToUrl(repo, thumb);
  return (
    <Image
      width={1920}
      height={1080}
      src={thumbnail}
      alt={alt}
      className="aspect-video"
    />
  );
}
