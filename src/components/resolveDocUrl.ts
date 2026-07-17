import { buildGitlabRawUrl, resolveRelativeDocPath } from "../lib/gitlabDocs";

type AbsoluteUrlKind = "http" | "blocked" | "relative";

function classifyUrl(url: string): AbsoluteUrlKind {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return "http";
    }
    return "blocked";
  } catch {
    return "relative";
  }
}

export function createDocUrlTransform(docPath: string): (url: string) => string {
  return (url: string) => {
    if (url.length === 0 || url.startsWith("#")) {
      return url;
    }

    const kind = classifyUrl(url);
    if (kind === "http") {
      return url;
    }
    if (kind === "blocked") {
      return "";
    }

    const repoPath = resolveRelativeDocPath(docPath, url);
    if (repoPath === null) {
      return "";
    }
    return buildGitlabRawUrl(repoPath);
  };
}
