import { isExternalEmbed, isExternalView } from "@/lib/pred";
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
  if (!isExternalEmbed(embed) && !isExternalView(embed)) return null;
  const {
    external: { description, title, uri: url, thumb },
  } = embed;
  const [repo] = parseAtUri(uri);
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <section className="rounded-lg overflow-hidden flex flex-col border divide-y">
        <ExternalThumb repo={repo} thumb={thumb} alt={title} />
        <div className="p-2">
          <h3 className="font-bold">{title || url}</h3>
          <p className="text-sm/5 line-clamp-2 line text-foreground/60">
            {description}
          </p>
        </div>
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
  thumb: BlobRef | string | undefined;
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
      className="aspect-video object-cover"
    />
  );
}
