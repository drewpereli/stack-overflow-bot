export const ANSWER_TYPE = [
  "condescending",
  "nobody-does-that",
  "duplicate",
  "confident-wrong-answer",
  "just-a-doc-link",
  "nitpicking",
  "demand-minimal-reproducible-example",
  "wont-do-homework",
  "general",
  "shameless-self-promotion",
] as const;

export type AnswerType = (typeof ANSWER_TYPE)[number];
