"use client";

import { useState } from "react";
import { createQuestion } from "./actions";
import NewQuestion from "./NewQuestion";

import { redirect } from "next/navigation";

export default function Chat() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    try {
      setSubmitting(true);
      const { id } = await createQuestion({ title, content });
      redirect(`/q/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return <NewQuestion onSubmit={onSubmit} isSubmitting={submitting} />;
}
