"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import QuestionDisplay from "./QuestionDisplay";
import { Answer, Question } from "@/generated/prisma";
import { UIMessage } from "ai";

export type QuestionWithAnswers = Pick<
  Question,
  "id" | "title" | "content" | "status"
> & {
  answers: Pick<Answer, "id" | "content" | "order">[];
};

export default function QuestionComponent({
  question,
}: {
  question: QuestionWithAnswers;
}) {
  const { responses } = useGenerateResponses(
    question,
    question.status === "PENDING",
  );

  return (
    <QuestionDisplay
      title={question.title}
      content={question.content ?? question.title}
      responses={question.status === "PENDING" ? responses : question.answers}
    />
  );
}

function useGenerateResponses(
  question: Pick<Question, "id" | "title" | "content">,
  enabled: boolean,
) {
  const [done, setDone] = useState(false);

  const { messages, stop, append } = useChat({
    api: `/api/questions/${question.id}/generate-answers`,
    onFinish: () => {
      setDone(true);
    },
  });

  const responses = messagesToResponseObjects(messages);

  // Kick off the generation request
  useEffect(() => {
    if (enabled) append({ role: "user", content: "" });

    return () => {
      new Promise((res) => setTimeout(res, 1)).then(() => stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { responses: responses, done };
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
