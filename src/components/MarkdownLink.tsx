import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "canopui";
import { VisuallyHidden } from "./VisuallyHidden";
import { useMarkdownLink } from "./useMarkdownLink";

export interface MarkdownLinkProps {
  href?: string;
  children?: ReactNode;
}

const linkStyle: CSSProperties = {
  color: "var(--canop-palette-primary-main)",
  textDecoration: "underline",
  textUnderlineOffset: "0.15rem",
  overflowWrap: "anywhere",
};

export function MarkdownLink({ href, children }: MarkdownLinkProps) {
  const { kind, onClick } = useMarkdownLink(href);
  const { t } = useTranslation();

  if (kind === "route") {
    return (
      <a href={href} onClick={onClick} style={linkStyle}>
        {children}
      </a>
    );
  }

  if (kind === "anchor") {
    return (
      <a href={href} style={linkStyle}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
      {children}
      <VisuallyHidden>{` ${t("doc.markdown.newTab")}`}</VisuallyHidden>
    </a>
  );
}
