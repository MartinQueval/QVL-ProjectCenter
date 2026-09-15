import Box from "@mui/material/Box";
import { Text } from "canopui";
import { useDocSearchSummary } from "./useDocSearchSummary";

export interface DocSearchSummaryProps {
  count: number;
  query: string;
}

export function DocSearchSummary({ count, query }: DocSearchSummaryProps) {
  const summary = useDocSearchSummary(count, query);

  return (
    <Box role="status" aria-live="polite">
      <Text variant="body-sm" tone="secondary">
        {summary}
      </Text>
    </Box>
  );
}
