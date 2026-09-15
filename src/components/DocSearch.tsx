import { useTranslation } from "canopui";
import { StickySearch } from "./StickySearch";

export interface DocSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function DocSearch({ value, onChange }: DocSearchProps) {
  const { t } = useTranslation();

  return (
    <StickySearch
      value={value}
      onChange={onChange}
      ariaLabel={t("doc.search.label")}
      placeholder={t("doc.search.placeholder")}
    />
  );
}
