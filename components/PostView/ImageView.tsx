import { isImageEmbed } from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";
import { cn } from "@/lib/utils";
import { BlobRef } from "@atproto/api";
import Image from "next/image";

export default function ImageView({
  uri,
  embed,
}: {
  uri: string;
  embed: unknown;
}) {
  if (!embed || !isImageEmbed(embed)) return null;
  const [repo] = parseAtUri(uri);
  const images = embed.images.map(({ image, alt = "", aspectRatio }) => ({
    src: blobRefToUrl(repo, image),
    alt,
    width: aspectRatio?.width ?? 0,
    height: aspectRatio?.height ?? 0,
  }));

  return (
    <section className="rounded-lg overflow-hidden grid grid-cols-2 gap-1 aspect-video">
      {images.map(({ src, alt, width, height }, index, { length }) =>
        length === 1 ? (
          <Image
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="col-span-2"
          />
        ) : (
          <Image
            key={src}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn("object-cover", {
              "row-span-2 aspect-[5/7]":
                length === 2 || (length === 3 && index === 0),
              "aspect-video": length === 4,
            })}
          />
        )
      )}
    </section>
  );
}

const blobRefToUrl = (repo: string, blobRef: BlobRef) =>
  `/img/${repo}/${blobRef.ref.$link}.${blobRef.mimeType.split("/")[1]}`;
