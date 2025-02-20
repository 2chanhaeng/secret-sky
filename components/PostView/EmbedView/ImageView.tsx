import {
  isImageEmbed,
  isRecordWithMediaEmbed,
  isImageView,
  isRecordWithMediaView,
} from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";
import { blobRefToUrl, cn, safeNumber } from "@/lib/utils";
import Image from "next/image";

export default function ImageView({
  uri,
  embed,
}: {
  uri: string;
  embed: unknown;
}) {
  const [repo] = parseAtUri(uri);
  const images = extractImages(repo, embed);
  if (!images.length) return null;
  if (images.length === 1) {
    const { src, alt, ...ratio } = images[0];
    const { width, height } = regulateAspectRatio(ratio);
    return (
      <section className="rounded-lg overflow-hidden h-fit max-h-[80vh] min-h-24 w-full object-center">
        <Image
          key={src}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-cover h-full w-full"
        />
      </section>
    );
  }
  return (
    <section className="rounded-lg overflow-hidden grid grid-cols-2 gap-1 aspect-video">
      {images.map(({ src, alt, width, height }, index, { length }) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn("object-cover object-center", {
            "row-span-2 aspect-[5/7]":
              length === 2 || (length === 3 && index === 0),
            "aspect-video": length === 4,
          })}
        />
      ))}
    </section>
  );
}

const extractImages = (repo: string, embed: unknown) => {
  if (isImageView(embed)) {
    return embed.images.map(({ fullsize, alt = "", aspectRatio }) => ({
      src: fullsize,
      alt,
      width: safeNumber(aspectRatio?.width),
      height: safeNumber(aspectRatio?.height),
    }));
  }
  if (isImageEmbed(embed)) {
    return embed.images.map(({ image, alt = "", aspectRatio }) => ({
      src: blobRefToUrl(repo, image),
      alt,
      width: safeNumber(aspectRatio?.width),
      height: safeNumber(aspectRatio?.height),
    }));
  }
  if (isRecordWithMediaEmbed(embed) && isImageEmbed(embed.media)) {
    return embed.media.images.map(({ image, alt = "", aspectRatio }) => ({
      src: blobRefToUrl(repo, image),
      alt,
      width: safeNumber(aspectRatio?.width),
      height: safeNumber(aspectRatio?.height),
    }));
  }
  if (isRecordWithMediaView(embed) && isImageView(embed.media)) {
    return embed.media.images.map(({ fullsize, alt = "", aspectRatio }) => ({
      src: fullsize,
      alt,
      width: safeNumber(aspectRatio?.width),
      height: safeNumber(aspectRatio?.height),
    }));
  }
  return [];
};

const regulateAspectRatio = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const aspectRatio = safeNumber(width / height, 1);
  if (aspectRatio > 1) {
    return { width: 1920, height: 1080 / aspectRatio };
  } else {
    return { width: 1920 * aspectRatio, height: 1080 };
  }
};
