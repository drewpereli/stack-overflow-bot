"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useState } from "react";

export default function AnswerDisplay({
  title,
  content,
  responses,
}: {
  title: string;
  content: string;
  responses: { id: string; content: string }[];
}) {
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    setViewCount(randomInt(2, 9));
  }, []);

  const responsesWithContent = responses.filter((r) => !!r.content);

  return (
    <main className="p-8 bg-white h-screen w-screen overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto">
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
          <Post content={content} score={0} />
        </div>

        <div className="space-y-8 mt-20">
          <h2 className="text-xl">
            {responsesWithContent.length === 1
              ? "1 Answer"
              : `${responsesWithContent.length} Answers`}
          </h2>

          {responsesWithContent.map((response) => (
            <Post
              key={response.id}
              content={response.content}
              score={0}
              className="pb-8 border-b border-so-black-25"
            />
          ))}
        </div>
      </div>
    </main>
  );
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

      <p className="text-black">{content}</p>
    </div>
  );
}
