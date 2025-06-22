"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import QuestionDisplay from "./QuestionDisplay";

export default function Question({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const { responses } = useGenerateResponses(`# ${title}\n\n${content ?? ""}`);

  return (
    <QuestionDisplay title={title} content={content} responses={responses} />
  );
}

function useGenerateResponses(prompt: string) {
  const [done, setDone] = useState(false);

  const [responses, setResponses] = useState<
    { id: string; content: string; status: "streaming" | "done" }[]
  >([]);

  const { messages, stop, append } = useChat({
    // Once the response is done, we can set the status to done and set all responses to done
    onFinish: () => {
      setDone(true);

      setResponses((prev) =>
        prev.map((response) => ({ ...response, status: "done" })),
      );
    },
  });

  useEffect(() => {
    // Get the assistant message
    const assistantMessage = messages.find((msg) => msg.role === "assistant");

    if (!assistantMessage) return;

    const parts = assistantMessage.parts;

    const textParts = parts.filter((p) => p.type === "text").map((p) => p.text);

    setResponses((prev) => {
      return textParts.map((text, index) => {
        const isLast = index === textParts.length - 1;

        const existing = prev[index];

        if (existing) {
          // Update existing response
          return {
            ...existing,
            content: text,
            status: isLast ? "streaming" : "done",
          };
        } else {
          // Create new response
          return {
            id: `response-${index}`,
            content: text,
            status: "streaming",
          };
        }
      });
    });
  }, [messages]);

  // Stupid strict mode issue workaround
  const initialized = useRef(false);

  // Kick off the chat with the initial prompt
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    append({ role: "user", content: prompt });

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { responses: responses, done };
}
