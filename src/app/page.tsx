"use client";

import { createQuestion } from "./actions";
import NewQuestion from "./NewQuestion";

import { redirect } from "next/navigation";

export default function Chat() {
  const onSubmit = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    const { id } = await createQuestion({ title, content });
    redirect(`/q/${id}`);
  };

  return <NewQuestion onSubmit={onSubmit} />;
}
