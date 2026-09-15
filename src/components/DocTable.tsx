import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "canopui";
import { DocScrollArea } from "./DocScrollArea";

export interface DocTableProps {
  children?: ReactNode;
}

const tableStyle: CSSProperties = {
  borderCollapse: "collapse",
  width: "100%",
  minWidth: "max-content",
  margin: 0,
};

export function DocTable({ children }: DocTableProps) {
  const { t } = useTranslation();

  return (
    <DocScrollArea label={t("doc.markdown.table")}>
      <table style={tableStyle}>{children}</table>
    </DocScrollArea>
  );
}
