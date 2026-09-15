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

describe("createDocUrlTransform - chemin repo documenté vers route interne", () => {
  const transform = createDocUrlTransform(doc);

  it("résout le README d'un projet documenté vers sa route de documentation", () => {
    expect(transform("../README.md")).toBe("/doc/custhome");
  });

  it("résout le README d'un autre projet documenté vers sa route de documentation", () => {
    expect(transform("../CH-Portal-Drive/README.md")).toBe("/doc/ch-portal-drive");
  });

  it("résout un projet documenté d'un autre dépôt vers sa route de documentation", () => {
    expect(transform("../../QVL-ProjectCenter/README.md")).toBe("/doc/projectcenter");
  });

  it("compare les chemins repo sans tenir compte de la casse", () => {
    expect(transform("../ch-api-budgy/readme.md")).toBe("/doc/ch-api-budgy");
  });

  it("conserve le fragment sur une route interne", () => {
    expect(transform("../CH-Portal-Drive/README.md#api")).toBe("/doc/ch-portal-drive#api");
  });

  it("replie sur l'URL raw un chemin repo qui n'est le docPath d'aucun projet", () => {
    expect(transform("../CHANGELOG.md")).toBe(rawUrl("QVL-CustHome/CHANGELOG.md"));
  });

  it("supprime le fragment sur une URL raw", () => {
    expect(transform("images/schema.png#zoom")).toBe(
      rawUrl("QVL-CustHome/CH-Api-Budgy/images/schema.png"),
    );
  });
});

describe("createDocUrlTransform - ancien schéma de routes", () => {
  const transform = createDocUrlTransform(doc);

  it("réécrit /{section}/{projet} vers /doc/{projet}", () => {
    expect(transform("/custhome/ch-portal-drive")).toBe("/doc/ch-portal-drive");
    expect(transform("/hobbies/hb-front-statbar")).toBe("/doc/hb-front-statbar");
    expect(transform("/toolbox/pipeboard")).toBe("/doc/pipeboard");
  });

  it("laisse une route /doc/{projet} inchangée", () => {
    expect(transform("/doc/ch-portal-drive")).toBe("/doc/ch-portal-drive");
  });

  it("conserve le fragment lors de la réécriture", () => {
    expect(transform("/custhome/ch-portal-drive#api")).toBe("/doc/ch-portal-drive#api");
  });

  it("replie sur l'URL raw quand le projet de l'ancienne route est inconnu", () => {
    const resultat = transform("/hobbies/inconnu");

    expect(resultat.startsWith("/doc/")).toBe(false);
    expect(resultat.startsWith(`${PROJECT_URL}/repository/files/`)).toBe(true);
  });
});
