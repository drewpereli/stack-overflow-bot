import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Question from "./Question";

export const dynamic = "force-dynamic";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      answers: {
        select: {
          order: true,
          content: true,
        },
      },
    },
  });

  if (!question) {
    notFound();
  }

  return (
    <Question
      title={question.title}
      content={question.content ?? question.title}
    />
  );
}
