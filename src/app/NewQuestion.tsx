"use client";

import { useState } from "react";

export default function NewQuestion({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: ({ title, content }: { title: string; content: string }) => void;
  isSubmitting: boolean;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <main className="p-8 bg-alt-bg basis-0 grow w-screen overflow-y-auto">
      <div className="w-full max-w-content-width mx-auto space-y-12">
        <h1 className="text-2xl font-bold">Ask a public question</h1>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ title, content });
          }}
        >
          <section className="space-y-8 bg-white shadow rounded p-4">
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="title">
                <span>Title</span>
                <span className="text-red-400" title="required">
                  *
                </span>
                <p className="font-normal text-xs">
                  Be specific and imagine you’re asking a question to another
                  person
                </p>
              </label>

              <input
                type="text"
                id="title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                className="p-2 text-sm border border-so-black-25 rounded w-full disabled:bg-gray-100"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="title">
                <span>Body</span>
                <span className="text-red-400" title="required">
                  *
                </span>
                <p className="font-normal text-xs">
                  Include all the information someone would need to answer your
                  question
                </p>
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                id="content"
                className="p-2 text-sm border border-so-black-25 rounded w-full disabled:bg-gray-100"
                rows={15}
                disabled={isSubmitting}
              />
            </div>
          </section>

          <button
            className="bg-button-bg disabled:bg-button-bg/80 p-2.5 rounded-lg text-white text-sm flex items-center gap-2"
            disabled={isSubmitting}
          >
            <span>Post your question</span>

            {isSubmitting && (
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-gray-200 animate-spin fill-blue-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
