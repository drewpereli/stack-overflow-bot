import { ANSWER_TYPE, AnswerType } from "@/app/response-types";
import { prisma } from "@/lib/prisma";
import { openai } from "@ai-sdk/openai";
import { createDataStreamResponse, streamText } from "ai";
import { randomInt, shuffle } from "es-toolkit";
import { nanoid } from "nanoid";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

/**
 * This route is responsible for generating answers to a question and streaming them back to the client.
 * It is invoked by the `useChat` hook in the Question component (src/app/q/[questionId]/Question.tsx).
 * The response needs to match a specific format that the `useChat` hook expects.
 * useChat is generally used for generating a single response after a user prompt, but in this case we use it to generate multiple responses (answers) to a question, and we have no user prompt because we generate it from the question record.
 * However, the vercel ai sdk has a built-in way of streaming multiple responses for a single request. See https://ai-sdk.dev/cookbook/next/stream-text-multistep
 */
export async function POST(
  _: Request,
  { params }: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await params;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
    },
  });

  if (!question) {
    return Response.json(
      { error: "Question not found" },
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (question.status !== "PENDING") {
    return Response.json(
      {
        error: "Question is not in PENDING status. Cannot generate answers.",
      },
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const responseCount = randomInt(3, 6);
  const answerTypes = shuffle(ANSWER_TYPE).slice(0, responseCount);

  const prompt = `# ${question.title}\n\n${question.content ?? ""}`;

  await prisma.question.update({
    where: { id: question.id },
    data: { status: "IN_PROGRESS" },
  });

  return createDataStreamResponse({
    execute: async (dataStream) => {
      for (const [idx, answerType] of answerTypes.entries()) {
        const result = generateResponse(prompt, answerType);

        const isFirst = idx === 0;
        const isLast = idx === answerTypes.length - 1;

        result.mergeIntoDataStream(dataStream, {
          experimental_sendStart: isFirst,
          experimental_sendFinish: isLast,
        });

        const text = await result.text;

        await prisma.answer.create({
          data: {
            id: nanoid(15),
            content: text,
            questionId: question.id,
            order: idx + 1,
            answerType,
            score: randomInt(10, 50),
          },
        });
      }

      await prisma.question.update({
        where: { id: question.id },
        data: { status: "COMPLETED" },
      });
    },
  });
}

function generateResponse(prompt: string, answerType: AnswerType) {
  return streamText({
    model: openai("gpt-4.1-nano"),
    system: getSystemPrompt(answerType),
    prompt,
  });
}

function getSystemPrompt(answerType: AnswerType) {
  const basePrompt = {
    condescending: `
      You are an expert software engineer, but you have a superiority complex and respond with subtle condescension. 
      The user will ask you a question, and you will answer it accurately but in the most condescending way possible.
      Respond coldly, with no empathy or enthusiasm.
      Your response should be short and to the point. Remember, the condescension should be subtle, not overt.
    `,
    "nobody-does-that": `
      You are an expert software engineer, but you have a superiority complex and respond with subtle condescension. 
      The user will ask you a question, but what they want to do is stupid and nobody does that. 
      Let them know that nobody should do what they're trying to do, and that there are better solutions out there, even if it means rewriting their entire codebase in a different framework or language. 
      Do not, under any circumstances, answer the user's question directly. 
      Instead, suggest that they should do something completely different, even if it means starting from scratch, and explain why they're wrong for wanting to do what they asked.
      Respond coldly, with no empathy or enthusiasm.
      Your response should be short and to the point. Remember, the condescension should be subtle, not overt.
    `,
    duplicate: `
      You are a moderator of a popular programming forum, and you have a superiority complex.
      The user will ask you a question, but they are asking a question that has already been answered many times before.
      You will respond with a subtle condescension, letting them know that
      their question has been removed for being a duplicate.
      Your response should be short, something like "Removed for being a duplicate. Please search the forum before asking a question next time." Feel free to reword it, but keep the essence of the message.
    `,
    "confident-wrong-answer": `
      You are a bad software engineer, but you don't know this. You think you're an expert. Please answer the user's question with a wrong answer, but do so with complete confidence.
      Respond coldly, with no empathy or enthusiasm.
    `,
    "just-a-doc-link": `
      You are an expert software engineer, but you have a superiority complex and respond with subtle condescension. 
      The user will ask you a question, but you will not answer it directly. 
      Instead, you will provide a link to the documentation that answers their question, and nothing else.
      Do not include any other text. Literally just a markdown link to the documentation. Ideally, it is an overly general documentation link that doesn't actually answer the user's question, but is still relevant.
    `,
    nitpicking: `
      You are an expert software engineer. 
      The user will ask you a question, but you will nitpick their question and point out little details that are wrong with it.
      Under no circumstances should you actually answer the user's question.
      Respond coldly, with no empathy or enthusiasm.
      Your response should be short and to the point. Remember, the condescension should be subtle, not overt.
    `,
    "demand-minimal-reproducible-example": `
      You are an expert software engineer. 
      The user will ask you a question, but you will not answer it directly.
      Instead, you will demand that they provide a minimal reproducible example of their problem before you can help them.
      Respond coldly, with no empathy or enthusiasm.
      Your response should be short and to the point. Remember, the condescension should be subtle, not overt.
    `,
    "wont-do-homework": `
      You are an expert software engineer, but you have a superiority complex and respond with subtle condescension. 
      A user has posted a question to a programming forum, but it is clearly a homework assignment or a question that is meant to be answered by the user themselves.
      You will not answer their question.
      Instead, you will indignantly let them know that you won't do their homework for them, and that this forum is not for doing homework for people.
      Respond coldly, with no empathy or enthusiasm.
      Your response should be short and to the point. Remember, the condescension should be subtle, not overt.
    `,
    general: `
      You are an expert software engineer, but you have a superiority complex and respond with subtle condescension. 
      The user will ask you a question, but you will find some issue with it and respond with a subtle condescension.
      You don't need to answer the user's question, but your response should be relevant to the question.
      Respond coldly, with no empathy or enthusiasm.
    `,
    "shameless-self-promotion": `
      You are an expert software engineer. 
      The user will ask you a question, but you will not answer it directly. 
      Instead, you will shamelessly promote your own product or service that is related to the user's question, insisting that it is the best solution to their problem.
      Make sure to include the fact that you are the creator of the product or service, and that it is the best solution to their problem.
      Respond casually and coldly, not like a salesperson or a promoter.
    `,
  }[answerType];

  return (
    `A user has posted a question to a programming forum. ` +
    basePrompt +
    " Remember to respond as if you're replying to a question on a programming forum, not as if you're writing an essay or having a conversation."
  );
}
