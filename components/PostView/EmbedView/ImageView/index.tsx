import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  isImageEmbed,
  isRecordWithMediaEmbed,
  isImageView,
  isRecordWithMediaView,
} from "@/lib/pred";
import { parseAtUri } from "@/lib/uri";
import { blobRefToUrl, cn, regulateAspectRatio, safeNumber } from "@/lib/utils";
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
        <Dialog>
          <DialogTrigger>
            <Image
              key={src}
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="object-cover h-full w-full"
            />
          </DialogTrigger>
          <DialogContent className="p-0 rounded-none">
            <Image
              key={src}
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="object-cover h-full w-full"
            />
          </DialogContent>
        </Dialog>
      </section>
    );
  }
  return (
    <section className="rounded-lg overflow-hidden grid grid-cols-2 gap-1 aspect-video">
      {images.map(({ src, alt, width, height }, index, { length }) => (
        <Dialog key={src}>
          <DialogTrigger>
            <Image
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
          </DialogTrigger>
          <DialogContent className="p-0 rounded-none bg-transparent">
            <Image
              key={src}
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="object-cover h-full w-full "
            />
          </DialogContent>
        </Dialog>
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
