"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export function PostWithUpdatingScore({
  initialScore,
  targetScore,
  animateScore,
  ...postProps
}: {
  initialScore: number;
  targetScore: number;
  animateScore: boolean;
} & Omit<PostProps, "score">) {
  const score = useUpdatingScore(initialScore, targetScore, animateScore);

  return <Post {...postProps} score={score} />;
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

type PostProps = {
  content: string;
  score: number;
  shareLink?: string;
  className?: string;
  id?: string;
};

export function Post({ content, score, shareLink, className, id }: PostProps) {
  return (
    <div
      className={`grid grid-cols-[2.5rem_1fr] items-start gap-x-4 gap-y-10 ${className ?? ""}`}
      id={id}
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

      <div className="space-y-10 col-start-2 text-sm">
        {shareLink ? <CopyableLink href={shareLink} /> : <>&nbsp;</>}
      </div>
    </div>
  );
}

function CopyableLink({ href }: { href: string }) {
  return (
    <button
      className="text-sm text-[rgb(99,107,116)] hover:text-gray-700 cursor-pointer"
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(href);
        toast.success("Link copied to clipboard");
      }}
    >
      Share
    </button>
  );
}
