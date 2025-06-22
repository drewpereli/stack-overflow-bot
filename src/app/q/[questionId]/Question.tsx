"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import QuestionDisplay from "./QuestionDisplay";
import { Answer, Question } from "@/generated/prisma";
import { UIMessage } from "ai";
import { revalidateQuestion } from "./actions";

export type QuestionWithAnswers = Pick<
  Question,
  "id" | "title" | "content" | "status" | "score"
> & {
  answers: Pick<Answer, "id" | "content" | "order" | "score">[];
};

export default function QuestionComponent({
  question,
}: {
  question: QuestionWithAnswers;
}) {
  const isPending = question.status === "PENDING";

  const { responses } = useGenerateResponses(question, {
    enabled: isPending,
    onFinish: () => revalidateQuestion(question.id),
  });

  // As you can see above, if the question is in the pending state, we start generating responses, then revalidate the question when the generation is done.
  // We use a ref to track if the question started as pending, so we can animate the scores after the generation and revalidation are complete.
  // If the question did not start as pending, we do not animate the scores.
  const startedAsPending = useRef(isPending);

  const displayResponses = isPending
    ? responses.map((r) => ({ ...r, score: 0 }))
    : question.answers;

  return (
    <QuestionDisplay
      title={question.title}
      content={question.content ?? question.title}
      score={question.score}
      responses={displayResponses}
      animateScores={startedAsPending.current}
    />
  );
}

function useGenerateResponses(
  question: Pick<Question, "id" | "title" | "content">,
  options: { enabled: boolean; onFinish: () => unknown },
) {
  const { messages, stop, append } = useChat({
    api: `/api/questions/${question.id}/generate-answers`,
    onFinish: () => {
      options.onFinish();
    },
  });

  const responses = messagesToResponseObjects(messages);

  // Kick off the generation request
  useEffect(() => {
    if (options.enabled) append({ role: "user", content: "" });

    return () => {
      new Promise((res) => setTimeout(res, 1)).then(() => stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.enabled]);

  return { responses };
}

function messagesToResponseObjects(
  messages: UIMessage[],
): { id: string; content: string }[] {
  const assistantMessage = messages.find((msg) => msg.role === "assistant");

  if (!assistantMessage) return [];

  const parts = assistantMessage.parts;

  const textParts = parts.filter((p) => p.type === "text").map((p) => p.text);

  return textParts.map((text, index) => {
    return {
      id: `response-${index}`,
      content: text,
    };
  });
}
