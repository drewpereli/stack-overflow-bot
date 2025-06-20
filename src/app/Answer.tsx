"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { shuffle, randomInt } from "es-toolkit";
import AnswerDisplay from "./AnswerDisplay";
import { RESPONSE_TYPES, ResponseType } from "./response-types";

export default function Answer({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [responseTypes] = useState<ResponseType[]>(() => {
    const responseCount = randomInt(3, 6);
    return shuffle(RESPONSE_TYPES).slice(0, responseCount);
  });

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

  const [responses, setResponses] = useState<
    { id: string; content: string; score: number }[]
  >([]);

  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    if (!isLoading && status === "ready") {
      complete(`${title}\n\n${content}`);

      // Add a new response to the responses array with a unique ID
      setResponses((prev) => [
        ...prev,
        { id: crypto.randomUUID(), content: "", score: 0 },
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

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== "ready") {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    function run() {
      if (status !== "ready") return;

      const updateUserScore = !!randomInt(0, 2);

      if (updateUserScore) {
        setUserScore((prev) => prev - 1);
      } else {
        setResponses((prev) => {
          if (!prev.length) return prev;
          const randResponseId = prev[randomInt(0, prev.length)].id;
          return prev.map((r) =>
            r.id === randResponseId ? { ...r, score: r.score + 1 } : r,
          );
        });
      }

      const nextDelay = 100 + randomInt(0, 300);
      timeoutRef.current = window.setTimeout(run, nextDelay);
    }

    timeoutRef.current = window.setTimeout(run, 100);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [status]);

  return (
    <AnswerDisplay
      title={title}
      content={content}
      userScore={userScore}
      responses={responses}
    />
  );
}
