"use client";

import { randomInt } from "es-toolkit";
import { useEffect, useState } from "react";
import { PostWithUpdatingScore } from "./Post";

export default function QuestionDisplay({
  title,
  content,
  responses,
}: {
  title: string;
  content: string;
  responses: { id: string; content: string; status?: "streaming" | "done" }[];
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
