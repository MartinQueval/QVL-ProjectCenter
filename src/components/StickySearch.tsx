import { Stack, Toolbar } from "canopui";
import { useStickySearch } from "./useStickySearch";

export interface StickySearchProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder: string;
}

export function StickySearch({ value, onChange, ariaLabel, placeholder }: StickySearchProps) {
  const { sticky, dockStyle } = useStickySearch();

  return (
    <Stack sticky={sticky} gap="xs">
      <div style={dockStyle}>
        <Toolbar ariaLabel={ariaLabel} search={{ value, onChange, placeholder }} />
      </div>
    </Stack>
  );
}
