"use server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function createQuestion({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  "use server";

  const { id } = await prisma.question.create({
    data: {
      id: nanoid(10),
      title,
      content,
    },
  });

  return { id };
}
