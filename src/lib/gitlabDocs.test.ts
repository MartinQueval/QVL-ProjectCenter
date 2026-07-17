import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildGitlabRawUrl, resolveRelativeDocPath } from "./gitlabDocs";

const PROJECT_URL = "https://gitlab.com/api/v4/projects/84403403";

beforeEach(() => {
  vi.stubEnv("VITE_DOCS_API_PROJECT_URL", PROJECT_URL);
  vi.stubEnv("VITE_DOCS_REF", "main");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("buildGitlabRawUrl", () => {
  it("encode un chemin simple à la racine du repo", () => {
    expect(buildGitlabRawUrl("README.md")).toBe(
      `${PROJECT_URL}/repository/files/README.md/raw?ref=main`,
    );
  });

  it("encode les séparateurs des chemins en sous-dossiers", () => {
    expect(buildGitlabRawUrl("QVL-CustHome/README.md")).toBe(
      `${PROJECT_URL}/repository/files/QVL-CustHome%2FREADME.md/raw?ref=main`,
    );
    expect(buildGitlabRawUrl("QVL-CustHome/CH-Api-Budgy/openapi.yaml")).toBe(
      `${PROJECT_URL}/repository/files/QVL-CustHome%2FCH-Api-Budgy%2Fopenapi.yaml/raw?ref=main`,
    );
  });

  it("encode les logos servis depuis le repo doc", () => {
    expect(buildGitlabRawUrl("projets/CanopUI/logo.png")).toBe(
      `${PROJECT_URL}/repository/files/projets%2FCanopUI%2Flogo.png/raw?ref=main`,
    );
  });

  it("normalise les préfixes ./ et / et les caractères à encoder", () => {
    expect(buildGitlabRawUrl("./QVL-Studio/README.md")).toBe(
      `${PROJECT_URL}/repository/files/QVL-Studio%2FREADME.md/raw?ref=main`,
    );
    expect(buildGitlabRawUrl("/QVL-Studio/README.md")).toBe(
      `${PROJECT_URL}/repository/files/QVL-Studio%2FREADME.md/raw?ref=main`,
    );
    expect(buildGitlabRawUrl("dossier avec espace/a&b.md")).toBe(
      `${PROJECT_URL}/repository/files/dossier%20avec%20espace%2Fa%26b.md/raw?ref=main`,
    );
  });

  it("respecte la ref configurée", () => {
    vi.stubEnv("VITE_DOCS_REF", "develop");
    expect(buildGitlabRawUrl("README.md")).toBe(
      `${PROJECT_URL}/repository/files/README.md/raw?ref=develop`,
    );
  });
});

describe("resolveRelativeDocPath", () => {
  const doc = "QVL-CustHome/CH-Api-Budgy/README.md";

  it("résout un lien ./ relatif au dossier du doc", () => {
    expect(resolveRelativeDocPath(doc, "./openapi.yaml")).toBe(
      "QVL-CustHome/CH-Api-Budgy/openapi.yaml",
    );
    expect(resolveRelativeDocPath(doc, "openapi.yaml")).toBe(
      "QVL-CustHome/CH-Api-Budgy/openapi.yaml",
    );
  });

  it("remonte d'un cran avec ../", () => {
    expect(resolveRelativeDocPath(doc, "../README.md")).toBe("QVL-CustHome/README.md");
    expect(resolveRelativeDocPath(doc, "../CH-Relay/README.md")).toBe(
      "QVL-CustHome/CH-Relay/README.md",
    );
  });

  it("résout une image en sous-dossier", () => {
    expect(resolveRelativeDocPath("QVL-ToolBox/AIGate/README.md", "images/schema.png")).toBe(
      "QVL-ToolBox/AIGate/images/schema.png",
    );
  });

  it("ignore les suffixes d'ancre et de query", () => {
    expect(resolveRelativeDocPath("QVL-CustHome/README.md", "./guide.md#section")).toBe(
      "QVL-CustHome/guide.md",
    );
    expect(resolveRelativeDocPath("QVL-CustHome/README.md", "./guide.md?ref=x")).toBe(
      "QVL-CustHome/guide.md",
    );
  });

  it("traite un chemin absolu (/) comme relatif à la racine du repo", () => {
    expect(resolveRelativeDocPath(doc, "/QVL-Studio/README.md")).toBe("QVL-Studio/README.md");
  });

  it("renvoie null quand le chemin sort de la racine ou est vide", () => {
    expect(resolveRelativeDocPath("README.md", "../foo.md")).toBeNull();
    expect(resolveRelativeDocPath(doc, "")).toBeNull();
    expect(resolveRelativeDocPath(doc, "#section")).toBeNull();
  });
});
