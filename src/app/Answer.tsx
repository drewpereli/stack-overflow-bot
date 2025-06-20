"use client";

import { useCompletion } from "@ai-sdk/react";
import { RESPONSE_TYPES, ResponseType } from "./api/completion/route";
import { useEffect, useMemo, useState } from "react";
import { shuffle, randomInt } from "es-toolkit";
import AnswerDisplay from "./AnswerDisplay";

export default function Answer({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const responseTypes = useMemo(() => {
    const responseCount = randomInt(2, 5);
    return shuffle(RESPONSE_TYPES).slice(0, responseCount);
  }, []);

  const [currentResponseType, setCurrentResponseType] = useState<ResponseType>(
    responseTypes[0],
  );

  const { completion, complete, isLoading } = useCompletion({
    body: {
      responseType: currentResponseType,
    },
  });

  const [status, setStatus] = useState<"initializing" | "ready" | "done">(
    "initializing",
  );

  const [responses, setResponses] = useState<{ id: string; content: string }[]>(
    [],
  );

  useEffect(() => {
    if (!isLoading && status === "ready") {
      complete(`${title}\n\n${content}`);

      // Add a new response to the responses array with a unique ID
      setResponses((prev) => [
        ...prev,
        { id: crypto.randomUUID(), content: "" },
      ]);

      const responseTypeIdx = responseTypes.indexOf(currentResponseType);

      if (responseTypeIdx === responseTypes.length - 1) {
        setStatus("done");
      } else {
        setCurrentResponseType(responseTypes[responseTypeIdx + 1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, status]);

  useEffect(() => {
    setResponses((prev) => {
      const oldResponses = prev.slice(0, -1);
      const newResponse = prev[prev.length - 1];

      if (newResponse) {
        return [...oldResponses, { ...newResponse, content: completion }];
      }

      return prev;
    });
  }, [completion]);

  useEffect(() => {
    setStatus("ready");
  }, []);

  return (
    <AnswerDisplay title={title} content={content} responses={responses} />
  );
}
