import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Question from "./Question";

export const dynamic = "force-dynamic";

export default async function QuestionPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
      score: true,
      answers: {
        select: {
          id: true,
          order: true,
          content: true,
          score: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!question) {
    notFound();
  }

  const searchParamsObj = await searchParams;

  const highlightedAnswerId =
    typeof searchParamsObj.a === "string" ? searchParamsObj.a : undefined;

  return (
    <Question question={question} highlightedAnswerId={highlightedAnswerId} />
  );
}
