import { notFound } from "next/navigation";
import prisma from "@/prisma";

export const getUri = (postId: string) =>
  prisma.post
    .findUniqueOrThrow({
      where: { id: postId },
      select: { uri: true },
    })
    .catch(notFound)
    .then((post) => post.uri ?? notFound());
