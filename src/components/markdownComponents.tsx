import type { CSSProperties, ReactNode } from "react";
import type { Components } from "react-markdown";
import { tokens } from "canopui";
import { DocCodeBlock } from "./DocCodeBlock";
import { DocTable } from "./DocTable";
import { MarkdownLink } from "./MarkdownLink";

const MONOSPACE_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const baseHeadingStyle: CSSProperties = {
  fontFamily: tokens.typography.fontFamily,
  fontWeight: tokens.typography.fontWeight.bold,
  lineHeight: tokens.typography.lineHeight.tight,
  color: "var(--canop-palette-text-primary)",
  margin: `${tokens.spacing.lg} 0 ${tokens.spacing.sm} 0`,
  scrollMarginTop: tokens.spacing["3xl"],
};

const paragraphStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  lineHeight: tokens.typography.lineHeight.relaxed,
};

const listStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  paddingLeft: tokens.spacing.lg,
};

const listItemStyle: CSSProperties = {
  marginBottom: tokens.spacing.xs,
};

const inlineCodeStyle: CSSProperties = {
  fontFamily: MONOSPACE_STACK,
  fontSize: tokens.typography.fontSize.sm,
  backgroundColor: "var(--canop-palette-secondary-light)",
  padding: `0.1rem ${tokens.spacing.xs}`,
  borderRadius: tokens.radius.sm,
  overflowWrap: "anywhere",
};

const blockCodeStyle: CSSProperties = {
  fontFamily: MONOSPACE_STACK,
  fontSize: tokens.typography.fontSize.sm,
  backgroundColor: "transparent",
  padding: 0,
  display: "block",
  whiteSpace: "pre",
};

const blockquoteStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
  borderLeft: "0.25rem solid var(--canop-palette-primary-light)",
  color: "var(--canop-palette-text-secondary)",
};

const cellStyle: CSSProperties = {
  border: "0.0625rem solid var(--canop-palette-divider)",
  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
  textAlign: "left",
};

const headerCellStyle: CSSProperties = {
  ...cellStyle,
  backgroundColor: "var(--canop-palette-secondary-light)",
  fontWeight: tokens.typography.fontWeight.semibold,
};

const imageStyle: CSSProperties = {
  maxWidth: "100%",
  height: "auto",
  verticalAlign: "middle",
  borderRadius: tokens.radius.sm,
};

const dividerStyle: CSSProperties = {
  border: "none",
  borderTop: "0.0625rem solid var(--canop-palette-divider)",
  margin: `${tokens.spacing.lg} 0`,
};

const detailsStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  padding: tokens.spacing.sm,
  border: "0.0625rem solid var(--canop-palette-divider)",
  borderRadius: tokens.radius.md,
};

const summaryStyle: CSSProperties = {
  minHeight: "2.75rem",
  padding: `${tokens.spacing.xs} 0`,
  cursor: "pointer",
  fontWeight: tokens.typography.fontWeight.semibold,
};

function flattenText(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(flattenText).join("");
  }
  return "";
}

type MarkdownHeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

function headingComponent(tag: MarkdownHeadingTag, scale: CSSProperties) {
  const headingStyle: CSSProperties = {
    ...baseHeadingStyle,
    ...scale,
  };

  return function MarkdownHeading({ id, children }: { id?: string; children?: ReactNode }) {
    const Tag = tag;
    return (
      <Tag id={id} style={headingStyle}>
        {children}
      </Tag>
    );
  };
}

export const markdownComponents: Components = {
  h1: headingComponent("h2", tokens.typography.heading.h4),
  h2: headingComponent("h3", tokens.typography.heading.h5),
  h3: headingComponent("h4", {
    ...tokens.typography.heading.h5,
    fontSize: tokens.typography.fontSize.lg,
  }),
  h4: headingComponent("h5", {
    ...tokens.typography.heading.h5,
    fontSize: tokens.typography.fontSize.md,
  }),
  h5: headingComponent("h6", {
    ...tokens.typography.heading.h5,
    fontSize: tokens.typography.fontSize.sm,
  }),
  h6: headingComponent("h6", {
    ...tokens.typography.heading.h5,
    fontSize: tokens.typography.fontSize.xs,
  }),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <MarkdownLink href={href}>{children}</MarkdownLink>
  ),
  p: ({ children }: { children?: ReactNode }) => <p style={paragraphStyle}>{children}</p>,
  ul: ({ children }: { children?: ReactNode }) => <ul style={listStyle}>{children}</ul>,
  ol: ({ children }: { children?: ReactNode }) => <ol style={listStyle}>{children}</ol>,
  li: ({ children }: { children?: ReactNode }) => <li style={listItemStyle}>{children}</li>,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote style={blockquoteStyle}>{children}</blockquote>
  ),
  pre: ({ children }: { children?: ReactNode }) => <DocCodeBlock>{children}</DocCodeBlock>,
  code: ({ className, children }: { className?: string; children?: ReactNode }) => {
    const isBlock =
      (typeof className === "string" && className.startsWith("language-")) ||
      flattenText(children).includes("\n");
    if (isBlock) {
      return (
        <code className={className} style={blockCodeStyle}>
          {children}
        </code>
      );
    }
    return <code style={inlineCodeStyle}>{children}</code>;
  },
  table: ({ children }: { children?: ReactNode }) => <DocTable>{children}</DocTable>,
  th: ({ children }: { children?: ReactNode }) => <th style={headerCellStyle}>{children}</th>,
  td: ({ children }: { children?: ReactNode }) => <td style={cellStyle}>{children}</td>,
  img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => (
    <img src={src} alt={alt ?? ""} title={title} loading="lazy" style={imageStyle} />
  ),
  hr: () => <hr style={dividerStyle} />,
  details: ({ children }: { children?: ReactNode }) => (
    <details style={detailsStyle}>{children}</details>
  ),
  summary: ({ children }: { children?: ReactNode }) => (
    <summary style={summaryStyle}>{children}</summary>
  ),
};
