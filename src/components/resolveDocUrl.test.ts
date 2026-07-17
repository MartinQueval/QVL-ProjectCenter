import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDocUrlTransform } from "./resolveDocUrl";

const PROJECT_URL = "https://gitlab.com/api/v4/projects/84403403";
const doc = "QVL-CustHome/CH-Api-Budgy/README.md";

function rawUrl(repoPath: string): string {
  return `${PROJECT_URL}/repository/files/${encodeURIComponent(repoPath)}/raw?ref=main`;
}

beforeEach(() => {
  vi.stubEnv("VITE_DOCS_API_PROJECT_URL", PROJECT_URL);
  vi.stubEnv("VITE_DOCS_REF", "main");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createDocUrlTransform", () => {
  const transform = createDocUrlTransform(doc);

  it("laisse les chaînes vides et les ancres inchangées", () => {
    expect(transform("")).toBe("");
    expect(transform("#usage")).toBe("#usage");
  });

  it("conserve les URLs http(s) absolues (badges, liens externes)", () => {
    expect(transform("https://img.shields.io/badge/build-passing-green")).toBe(
      "https://img.shields.io/badge/build-passing-green",
    );
    expect(transform("http://example.com/page")).toBe("http://example.com/page");
  });

  it("supprime les protocoles non http(s)", () => {
    expect(transform("mailto:team@qvl.com")).toBe("");
    expect(transform("javascript:alert(1)")).toBe("");
  });

  it("transforme un lien relatif markdown en URL API v4", () => {
    expect(transform("../README.md")).toBe(rawUrl("QVL-CustHome/README.md"));
  });

  it("transforme une image relative en URL API v4", () => {
    expect(transform("images/schema.png")).toBe(
      rawUrl("QVL-CustHome/CH-Api-Budgy/images/schema.png"),
    );
  });

  it("transforme un lien relatif .yaml (spec OpenAPI) en URL API v4", () => {
    expect(transform("./openapi.yaml")).toBe(
      rawUrl("QVL-CustHome/CH-Api-Budgy/openapi.yaml"),
    );
  });

  it("supprime un lien relatif qui sort de la racine du repo", () => {
    const rootTransform = createDocUrlTransform("README.md");
    expect(rootTransform("../secret.md")).toBe("");
  });
});
