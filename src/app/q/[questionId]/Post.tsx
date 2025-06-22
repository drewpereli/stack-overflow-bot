"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export function PostWithUpdatingScore({
  content,
  initialScore,
  targetScore,
  animateScore,
  shareLink,
  className,
}: {
  content: string;
  initialScore: number;
  targetScore: number;
  animateScore: boolean;
  shareLink?: string;
  className?: string;
}) {
  const score = useUpdatingScore(initialScore, targetScore, animateScore);

  return (
    <Post
      content={content}
      score={score}
      shareLink={shareLink}
      className={className}
    />
  );
}

function useUpdatingScore(initial: number, target: number, enabled: boolean) {
  const [score, setScore] = useState(enabled ? initial : target);

  useEffect(() => {
    let stopped = false;

    if (!enabled) {
      setScore(target);
    } else {
      setScore(initial);

      const stepCount = Math.abs(target - initial);
      const delays = Array.from({ length: stepCount }, () =>
        randomInt(200, 600),
      );

      (async () => {
        for (const delay of delays) {
          if (stopped) break;

          await new Promise((resolve) => setTimeout(resolve, delay));

          setScore((prevScore) => {
            if (target > prevScore) {
              return prevScore + 1;
            } else if (target < prevScore) {
              return prevScore - 1;
            }
            return prevScore;
          });
        }
      })();
    }

    return () => {
      stopped = true;
    };
  }, [initial, target, enabled]);

  return score;
}

export function Post({
  content,
  score,
  shareLink,
  className,
}: {
  content: string;
  score: number;
  shareLink?: string;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-[2.5rem_1fr] items-start gap-x-4 gap-y-10 ${className ?? ""}`}
    >
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

      {shareLink && (
        <div className="space-y-10 col-start-2 text-sm">
          <button
            className="text-[rgb(99,107,116)] cursor-pointer"
            type="button"
            onClick={() => navigator.clipboard.writeText(shareLink)}
          >
            Share
          </button>
        </div>
      )}
    </div>
  );
}
