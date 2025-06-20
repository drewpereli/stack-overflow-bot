'use client';

export default function Ask({title, content, setTitle, setContent, onSubmit}: {
  title: string;
  content: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <form className="flex flex-col gap-4" onSubmit={(e) => {e.preventDefault(); onSubmit()}}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Ask</button>
      </form>
    </div>
  );

}