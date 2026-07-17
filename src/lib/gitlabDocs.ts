function docsApiProjectUrl(): string {
  return import.meta.env.VITE_DOCS_API_PROJECT_URL;
}

function docsRef(): string {
  return import.meta.env.VITE_DOCS_REF;
}

function normalizeRepoPath(repoPath: string): string {
  return repoPath
    .trim()
    .replace(/^\.?\/+/, "")
    .replace(/\/+$/, "");
}

export function buildGitlabRawUrl(repoPath: string): string {
  const encodedPath = encodeURIComponent(normalizeRepoPath(repoPath));
  const base = docsApiProjectUrl().replace(/\/+$/, "");
  const ref = encodeURIComponent(docsRef());
  return `${base}/repository/files/${encodedPath}/raw?ref=${ref}`;
}

function directorySegments(docPath: string): string[] {
  const segments = normalizeRepoPath(docPath)
    .split("/")
    .filter((segment) => segment.length > 0);
  segments.pop();
  return segments;
}

export function resolveRelativeDocPath(currentDocPath: string, relativeUrl: string): string | null {
  const pathPart = relativeUrl.split(/[?#]/)[0] ?? "";
  if (pathPart.length === 0) {
    return null;
  }

  const isRootAbsolute = pathPart.startsWith("/");
  const segments = isRootAbsolute ? [] : directorySegments(currentDocPath);

  for (const rawSegment of pathPart.split("/")) {
    if (rawSegment.length === 0 || rawSegment === ".") {
      continue;
    }
    if (rawSegment === "..") {
      if (segments.length === 0) {
        return null;
      }
      segments.pop();
      continue;
    }
    segments.push(rawSegment);
  }

  if (segments.length === 0) {
    return null;
  }

  return segments.join("/");
}
