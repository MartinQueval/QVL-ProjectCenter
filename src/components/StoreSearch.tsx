import { StickySearch } from "./StickySearch";

export interface StoreSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SEARCH_LABEL = "Recherche d'applications";

const SEARCH_PLACEHOLDER = "Rechercher une application";

export function StoreSearch({ value, onChange }: StoreSearchProps) {
  return (
    <StickySearch
      value={value}
      onChange={onChange}
      ariaLabel={SEARCH_LABEL}
      placeholder={SEARCH_PLACEHOLDER}
    />
  );
}
