import { StickySearch } from "./StickySearch";

export interface DocSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SEARCH_LABEL = "Recherche dans la documentation";

const SEARCH_PLACEHOLDER = "Rechercher un projet";

export function DocSearch({ value, onChange }: DocSearchProps) {
  return (
    <StickySearch
      value={value}
      onChange={onChange}
      ariaLabel={SEARCH_LABEL}
      placeholder={SEARCH_PLACEHOLDER}
    />
  );
}
