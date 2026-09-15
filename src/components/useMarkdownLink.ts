import { useCallback, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

export type MarkdownLinkKind = "route" | "anchor" | "external";

export interface UseMarkdownLinkResult {
  kind: MarkdownLinkKind;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

function opensElsewhere(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function linkKind(href: string | undefined): MarkdownLinkKind {
  if (href === undefined) {
    return "external";
  }
  if (href.startsWith("/")) {
    return "route";
  }
  return href.startsWith("#") ? "anchor" : "external";
}

export function useMarkdownLink(href: string | undefined): UseMarkdownLinkResult {
  const navigate = useNavigate();
  const kind = linkKind(href);
  const routeHref = kind === "route" ? href : undefined;

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (routeHref === undefined || opensElsewhere(event)) {
        return;
      }
      event.preventDefault();
      navigate(routeHref);
    },
    [routeHref, navigate],
  );

  return { kind, onClick };
}
