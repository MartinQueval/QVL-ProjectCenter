import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeSanitize from "rehype-sanitize";
import { tokens } from "canopui";
import { markdownComponents } from "./markdownComponents";
import { markdownSanitizeSchema } from "./markdownSanitizeSchema";
import { useMarkdownDoc } from "./useMarkdownDoc";

export interface MarkdownDocProps {
  markdown: string;
  docPath: string;
}

const READABLE_MEASURE = "70ch";

const containerStyle: CSSProperties = {
  color: "var(--canop-palette-text-primary)",
  fontFamily: tokens.typography.fontFamily,
  fontSize: tokens.typography.fontSize.md,
  lineHeight: tokens.typography.lineHeight.normal,
  width: "100%",
  maxWidth: READABLE_MEASURE,
  minWidth: 0,
  overflowWrap: "anywhere",
};

export function MarkdownDoc({ markdown, docPath }: MarkdownDocProps) {
  const { urlTransform, enter } = useMarkdownDoc(docPath);

  return (
    <motion.div
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
      style={containerStyle}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeSanitize, markdownSanitizeSchema]]}
        urlTransform={urlTransform}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </motion.div>
  );
}
