"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AnswerDisplay({
  title,
  content,
  responses,
}: {
  title: string;
  content: string;
  responses: { id: string; content: string; status: "streaming" | "done" }[];
}) {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    setViewCount(randomInt(2, 9));
  }, []);

  const responsesWithContent = responses.filter((r) => !!r.content);

  return (
    <main className="p-8 bg-white basis-0 grow w-screen overflow-y-auto">
      <div className="w-full max-w-content-width mx-auto">
        <div className="border-b border-so-black-25 pb-3 space-y-3">
          <h1 className="text-black text-2xl">{title}</h1>
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
            content={content || title}
            initialScore={0}
            shouldUpdateScore={true}
            scoreDirection="down"
          />
        </div>

        <div className="space-y-8 mt-20">
          <h2 className="text-xl">
            {responsesWithContent.length === 1
              ? "1 Answer"
              : `${responsesWithContent.length} Answers`}
          </h2>

          {responsesWithContent.map((response) => (
            <PostWithUpdatingScore
              key={response.id}
              content={response.content}
              shouldUpdateScore={response.status === "done"}
              initialScore={0}
              scoreDirection="up"
              className="pb-8 border-b border-so-black-25"
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function PostWithUpdatingScore({
  content,
  shouldUpdateScore,
  initialScore,
  scoreDirection,
  className,
}: {
  content: string;
  shouldUpdateScore: boolean;
  initialScore: number;
  scoreDirection: "up" | "down";
  className?: string;
}) {
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    if (!shouldUpdateScore) return;

    const abortController = new AbortController();

    const scoreChangeCount = randomInt(5, 20);

    const timeouts = Array.from({ length: scoreChangeCount }, () =>
      randomInt(300, 1000),
    );

    (async () => {
      for (const timeout of timeouts) {
        if (abortController.signal.aborted) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, timeout));

        setScore((prevScore) =>
          scoreDirection === "up" ? prevScore + 1 : prevScore - 1,
        );
      }
    })();

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldUpdateScore]);

  return <Post content={content} score={score} className={className} />;
}

function Post({
  content,
  score,
  className,
}: {
  content: string;
  score: number;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-4 ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-2">
        <span className="flex items-center justify-center w-10 h-10 rounded-full border border-so-black-25">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M1 12h16L9 4z"></path>
          </svg>
        </span>

        <span className="text-xl font-bold">{score}</span>

        <span className="flex items-center justify-center w-10 h-10 rounded-full border border-so-black-25">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M1 6h16l-8 8z"></path>
          </svg>
        </span>
      </div>

      <div className="text-black markdown">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
