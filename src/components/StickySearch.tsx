import Box from "@mui/material/Box";
import { Stack, Toolbar } from "canopui";
import { useStickySearch } from "./useStickySearch";

export interface StickySearchProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder: string;
}

export function StickySearch({ value, onChange, ariaLabel, placeholder }: StickySearchProps) {
  const { sticky, dockSx } = useStickySearch();

  return (
    <Stack sticky={sticky} gap="xs">
      <Box sx={dockSx}>
        <Toolbar ariaLabel={ariaLabel} search={{ value, onChange, placeholder }} />
      </Box>
    </Stack>
  );
}
