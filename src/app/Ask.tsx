"use client";

export default function Ask({
  title,
  content,
  setTitle,
  setContent,
  onSubmit,
}: {
  title: string;
  content: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  onSubmit: () => void;
}) {
  return (
    <main className="p-8 bg-alt-bg basis-0 grow w-screen overflow-y-auto">
      <div className="w-full max-w-content-width mx-auto space-y-12">
        <h1 className="text-2xl font-bold">Ask a public question</h1>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                className="p-2 text-sm border border-so-black-25 rounded w-full"
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
                id="content"
                className="p-2 text-sm border border-so-black-25 rounded w-full"
                rows={15}
              />
            </div>
          </section>

          <button className="bg-button-bg p-2.5 rounded-lg text-white text-sm">
            Post your question
          </button>
        </form>
      </div>
    </main>
  );
}
