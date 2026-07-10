import { useCallback, useEffect, useState } from "react";

export type ProjectDocErrorKind = "notFound" | "network";

export type ProjectDocState =
  | { status: "loading" }
  | { status: "error"; kind: ProjectDocErrorKind; retry: () => void }
  | { status: "success"; markdown: string };

export function useProjectDoc(docPath: string): ProjectDocState {
  const [state, setState] = useState<ProjectDocState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    const url = new URL(docPath, import.meta.env.VITE_DOCS_BASE_URL).href;

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (controller.signal.aborted) return;
        if (response.status === 404) {
          setState({ status: "error", kind: "notFound", retry });
          return;
        }
        if (!response.ok) {
          setState({ status: "error", kind: "network", retry });
          return;
        }
        const markdown = await response.text();
        if (controller.signal.aborted) return;
        setState({ status: "success", markdown });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ status: "error", kind: "network", retry });
      });

    return () => controller.abort();
  }, [docPath, attempt, retry]);

  return state;
}
