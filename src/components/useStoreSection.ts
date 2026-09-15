import { useBreakpointDown } from "canopui";

export interface UseStoreSectionResult {
  compact: boolean;
}

export function useStoreSection(): UseStoreSectionResult {
  return { compact: useBreakpointDown("sm") };
}
