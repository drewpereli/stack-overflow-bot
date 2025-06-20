export const RESPONSE_TYPES = [
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

export type ResponseType = (typeof RESPONSE_TYPES)[number];
