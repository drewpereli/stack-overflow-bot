import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Markdown from "react-markdown";

const meta = {
  title: "Example/Markdown",
  component: Markdown,
  argTypes: {
    children: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="markdown">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const markdown = `
This is some text.

\`const a = "b";\`

A [link](https://example.com).

\`\`\`
function example() {
  console.log("This is a code block");
}
\`\`\`
`.trim();

export const Main: Story = {
  args: {
    children: markdown,
  },
};
