import type { CSSProperties, ReactNode } from "react";

export interface VisuallyHiddenProps {
  children: ReactNode;
}

const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: "0.0625rem",
  height: "0.0625rem",
  margin: "-0.0625rem",
  padding: 0,
  border: 0,
  overflow: "hidden",
  whiteSpace: "nowrap",
  clipPath: "inset(50%)",
};

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span style={visuallyHiddenStyle}>{children}</span>;
}
