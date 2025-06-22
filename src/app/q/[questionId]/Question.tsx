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

  // As you can see above, if the question is in the pending state, we start generating responses, then revalidate the question when the responses are done generating.
  // As the responses stream in, their scores will all be 0. But once the generation is done, we want to animate the scores of the responses to their final values.
  // However, we don't want to animate anything if the question was not in the pending state to begin with, because then the scores are already final and we don't want to animate them.
  // We use a ref to track if the question started as pending, so we can animate the scores after the generation is done and the question is revalidated, which will update the scores of the responses.
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

// This hook is responsible for kicking of the generation of answer records to the question, streaming them in, and parsing them into a format that can be displayed in the UI.
// It kinda hacks the useChat hook to make it work with our API.
// The target route (`/api/questions/${question.id}/generate-answers`) uses vercel ai's multi-step text streaming feature to stream multiple sequential responses for a single request.
// See https://ai-sdk.dev/cookbook/next/stream-text-multistep
// The result in `messages` is still a single assistant message at the end of the array, but the message has a `parts` array that has multiple text parts.
// Each text part is a separate response.
// The `messagesToResponseObjects` below parses out those parts and returns an array of response objects that can be displayed in the UI.
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
