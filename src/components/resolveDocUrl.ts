import { getDocProjects, getProject, getSection } from "../data/projects";
import { DOC_PATH } from "../hooks/useAppNavigation";
import { buildGitlabRawUrl, resolveRelativeDocPath } from "../lib/gitlabDocs";

type AbsoluteUrlKind = "http" | "blocked" | "relative";

function repoPathKey(repoPath: string): string {
  return repoPath.replace(/^\/+/, "").toLowerCase();
}

const PROJECT_ID_BY_DOC_PATH = new Map(
  getDocProjects().map((project) => [repoPathKey(project.docPath), project.id]),
);

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

function splitHash(url: string): { path: string; hash: string } {
  const index = url.indexOf("#");
  if (index === -1) {
    return { path: url, hash: "" };
  }
  return { path: url.slice(0, index), hash: url.slice(index) };
}

function siteRouteProjectId(path: string): string | undefined {
  if (!path.startsWith("/")) {
    return undefined;
  }

  const segments = path.split("/").filter((segment) => segment.length > 0);
  const [root, projectId] = segments;
  if (segments.length !== 2 || root === undefined || projectId === undefined) {
    return undefined;
  }

  const isKnownRoot = getSection(root) !== undefined || `/${root}` === DOC_PATH;
  if (!isKnownRoot) {
    return undefined;
  }

  return getProject(projectId)?.id;
}

function docRoute(projectId: string, hash: string): string {
  return `${DOC_PATH}/${projectId}${hash}`;
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

    const { path, hash } = splitHash(url);

    const siteProjectId = siteRouteProjectId(path);
    if (siteProjectId !== undefined) {
      return docRoute(siteProjectId, hash);
    }

    const repoPath = resolveRelativeDocPath(docPath, path);
    if (repoPath === null) {
      return "";
    }

    const documentedProjectId = PROJECT_ID_BY_DOC_PATH.get(repoPathKey(repoPath));
    if (documentedProjectId !== undefined) {
      return docRoute(documentedProjectId, hash);
    }

    return buildGitlabRawUrl(repoPath);
  };
}
