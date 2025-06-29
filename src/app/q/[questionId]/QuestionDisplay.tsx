"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useRef, useState } from "react";
import { PostWithUpdatingScore } from "./Post";
import { Answer, Question } from "@/generated/prisma";

export type QuestionData = Pick<
  Question,
  "id" | "title" | "content" | "score"
> & {
  answers: Pick<Answer, "id" | "content" | "score">[];
};

export default function QuestionDisplay({
  question,
  animateScores,
  includeShareLinks,
  highlightedAnswerId,
}: {
  question: QuestionData;
  animateScores: boolean;
  includeShareLinks: boolean;
  highlightedAnswerId?: string;
}) {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    setViewCount(randomInt(2, 9));
  }, []);

  const responsesWithContent = question.answers.filter((r) => !!r.content);

  const isClient = useIsClient();

  const scrollContainer = useRef(null);

  useEffect(() => {
    if (highlightedAnswerId && scrollContainer.current) {
      const highlightedElement = (
        scrollContainer.current as HTMLElement
      ).querySelector(`#${highlightedAnswerId}`);

      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "start",
        });
      }
    }
  }, [highlightedAnswerId]);

  return (
    <main
      className="p-8 bg-white basis-0 grow w-screen overflow-y-auto"
      ref={scrollContainer}
    >
      <div className="w-full max-w-content-width mx-auto">
        <div className="border-b border-so-black-25 pb-3 space-y-3">
          <h1 className="text-black text-2xl">{question.title}</h1>
          <p className="text-sm flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="text-gray-500">Asked</span>
              <span>1 minute ago</span>
            </span>

            <span className="flex items-center gap-1">
              <span className="text-gray-500">Viewed</span>
              <span>{viewCount} billion times</span>
            </span>
          </p>
        </div>

        <div className="mt-3">
          <PostWithUpdatingScore
            content={question.content || question.title}
            initialScore={0}
            targetScore={question.score}
            animateScore={animateScores}
            shareLink={
              includeShareLinks && isClient
                ? relativeUrlToAbsolute(`/q/${question.id}`)
                : undefined
            }
          />
        </div>

        <div className="space-y-4 mt-10">
          <h2 className="text-xl">
            {responsesWithContent.length === 1
              ? "1 Answer"
              : `${responsesWithContent.length} Answers`}
          </h2>

          {responsesWithContent.map((response) => (
            <PostWithUpdatingScore
              key={response.id}
              id={response.id}
              content={response.content}
              initialScore={0}
              targetScore={response.score}
              animateScore={animateScores}
              shareLink={
                includeShareLinks && isClient
                  ? relativeUrlToAbsolute(`/q/${question.id}?a=${response.id}`)
                  : undefined
              }
              className={`py-4 border-b border-so-black-25 ${response.id === highlightedAnswerId ? "highlight" : ""}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

// This should only be used on the client side, as it relies on `window.location`.
function relativeUrlToAbsolute(path: string): string {
  const currentOrigin = new URL(window.location.href).origin;

  return new URL(path, currentOrigin).toString();
}
