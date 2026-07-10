import { defaultSchema } from "rehype-sanitize";

export const markdownSanitizeSchema: typeof defaultSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary", "br"],
  attributes: {
    ...defaultSchema.attributes,
    code: [["className", /^language-/]],
    img: ["src", "alt", "title"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["http", "https"],
  },
};
