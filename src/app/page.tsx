"use client";

import { useState } from "react";
import Ask from "./Ask";
import Answer from "./Answer";

export default function Chat() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!submitted) {
    return (
      <Ask
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        onSubmit={() => setSubmitted(true)}
      />
    );
  } else {
    return <Answer title={title} content={content} />;
  }
}
