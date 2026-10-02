import { useTranslation } from "@canop/ui";
import { StickySearch } from "./StickySearch";

export interface StoreSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function StoreSearch({ value, onChange }: StoreSearchProps) {
  const { t } = useTranslation();

  return (
    <StickySearch
      value={value}
      onChange={onChange}
      ariaLabel={t("store.search.label")}
      placeholder={t("store.search.placeholder")}
    />
  );
}
