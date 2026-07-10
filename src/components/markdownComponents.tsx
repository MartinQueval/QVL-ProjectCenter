import type { CSSProperties, ReactNode } from "react";
import type { Components } from "react-markdown";
import { tokens } from "canopui";

const MONOSPACE_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const baseHeadingStyle: CSSProperties = {
  fontFamily: tokens.typography.fontFamily,
  fontWeight: tokens.typography.fontWeight.bold,
  lineHeight: tokens.typography.lineHeight.tight,
  color: "var(--ch-palette-text-primary)",
  margin: `${tokens.spacing.lg} 0 ${tokens.spacing.sm} 0`,
};

const linkStyle: CSSProperties = {
  color: "var(--ch-palette-primary-main)",
  textDecoration: "underline",
  textUnderlineOffset: "0.15rem",
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
  backgroundColor: "var(--ch-palette-secondary-light)",
  padding: `0.1rem ${tokens.spacing.xs}`,
  borderRadius: tokens.radius.sm,
};

const blockCodeStyle: CSSProperties = {
  fontFamily: MONOSPACE_STACK,
  fontSize: tokens.typography.fontSize.sm,
  backgroundColor: "transparent",
  padding: 0,
  display: "block",
  whiteSpace: "pre",
};

const preStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  padding: tokens.spacing.md,
  backgroundColor: "var(--ch-palette-secondary-light)",
  borderRadius: tokens.radius.md,
  overflowX: "auto",
};

const blockquoteStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
  borderLeft: "0.25rem solid var(--ch-palette-primary-light)",
  color: "var(--ch-palette-text-secondary)",
};

const tableStyle: CSSProperties = {
  borderCollapse: "collapse",
  width: "100%",
  margin: `0 0 ${tokens.spacing.md} 0`,
  display: "block",
  overflowX: "auto",
};

const cellStyle: CSSProperties = {
  border: "0.0625rem solid var(--ch-palette-divider)",
  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
  textAlign: "left",
};

const headerCellStyle: CSSProperties = {
  ...cellStyle,
  backgroundColor: "var(--ch-palette-secondary-light)",
  fontWeight: tokens.typography.fontWeight.semibold,
};

const imageStyle: CSSProperties = {
  maxWidth: "100%",
  height: "auto",
  borderRadius: tokens.radius.sm,
};

const dividerStyle: CSSProperties = {
  border: "none",
  borderTop: "0.0625rem solid var(--ch-palette-divider)",
  margin: `${tokens.spacing.lg} 0`,
};

const detailsStyle: CSSProperties = {
  margin: `0 0 ${tokens.spacing.md} 0`,
  padding: tokens.spacing.sm,
  border: "0.0625rem solid var(--ch-palette-divider)",
  borderRadius: tokens.radius.md,
};

const summaryStyle: CSSProperties = {
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

function headingComponent(tag: "h2" | "h3" | "h4" | "h5" | "h6", fontSize: string) {
  return function MarkdownHeading({ children }: { children?: ReactNode }) {
    const Tag = tag;
    return <Tag style={{ ...baseHeadingStyle, fontSize }}>{children}</Tag>;
  };
}

export const markdownComponents: Components = {
  h1: headingComponent("h2", tokens.typography.heading.h4),
  h2: headingComponent("h3", tokens.typography.heading.h5),
  h3: headingComponent("h4", tokens.typography.fontSize.lg),
  h4: headingComponent("h5", tokens.typography.fontSize.md),
  h5: headingComponent("h6", tokens.typography.fontSize.sm),
  h6: headingComponent("h6", tokens.typography.fontSize.xs),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
      {children}
    </a>
  ),
  p: ({ children }: { children?: ReactNode }) => <p style={paragraphStyle}>{children}</p>,
  ul: ({ children }: { children?: ReactNode }) => <ul style={listStyle}>{children}</ul>,
  ol: ({ children }: { children?: ReactNode }) => <ol style={listStyle}>{children}</ol>,
  li: ({ children }: { children?: ReactNode }) => <li style={listItemStyle}>{children}</li>,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote style={blockquoteStyle}>{children}</blockquote>
  ),
  pre: ({ children }: { children?: ReactNode }) => <pre style={preStyle}>{children}</pre>,
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
  table: ({ children }: { children?: ReactNode }) => <table style={tableStyle}>{children}</table>,
  th: ({ children }: { children?: ReactNode }) => <th style={headerCellStyle}>{children}</th>,
  td: ({ children }: { children?: ReactNode }) => <td style={cellStyle}>{children}</td>,
  img: ({ src, alt, title }: { src?: string; alt?: string; title?: string }) => (
    <img src={src} alt={alt ?? ""} title={title} style={imageStyle} />
  ),
  hr: () => <hr style={dividerStyle} />,
  details: ({ children }: { children?: ReactNode }) => (
    <details style={detailsStyle}>{children}</details>
  ),
  summary: ({ children }: { children?: ReactNode }) => (
    <summary style={summaryStyle}>{children}</summary>
  ),
};
