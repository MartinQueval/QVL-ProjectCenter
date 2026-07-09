import { useMemo, type CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { tokens } from "canopui";
import { markdownComponents } from "./markdownComponents";
import { markdownSanitizeSchema } from "./markdownSanitizeSchema";
import { createDocUrlTransform } from "./resolveDocUrl";

export interface MarkdownDocProps {
  markdown: string;
  docPath: string;
}

const containerStyle: CSSProperties = {
  color: "var(--ch-palette-text-primary)",
  fontFamily: tokens.typography.fontFamily,
  fontSize: tokens.typography.fontSize.md,
  lineHeight: tokens.typography.lineHeight.normal,
  wordBreak: "break-word",
};

export function MarkdownDoc({ markdown, docPath }: MarkdownDocProps) {
  const urlTransform = useMemo(() => createDocUrlTransform(docPath), [docPath]);

  return (
    <div style={containerStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]]}
        urlTransform={urlTransform}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
