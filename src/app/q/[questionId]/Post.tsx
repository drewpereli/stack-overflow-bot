"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function PostWithUpdatingScore({
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

export function Post({
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
