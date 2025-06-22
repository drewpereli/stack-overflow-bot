"use server";

import { revalidatePath } from "next/cache";

export async function revalidateQuestion(questionId: string) {
  revalidatePath(`/q/${questionId}`);
}
