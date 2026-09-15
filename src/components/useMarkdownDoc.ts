import { useMemo } from "react";
import { useEnterAnimation, type UseEnterAnimationResult } from "canopui";
import { createDocUrlTransform } from "./resolveDocUrl";

export interface UseMarkdownDocResult {
  urlTransform: (url: string) => string;
  enter: UseEnterAnimationResult;
}

export function useMarkdownDoc(docPath: string): UseMarkdownDocResult {
  const urlTransform = useMemo(() => createDocUrlTransform(docPath), [docPath]);
  const enter = useEnterAnimation({ direction: "up", distance: "0.5rem" });

  return { urlTransform, enter };
}
