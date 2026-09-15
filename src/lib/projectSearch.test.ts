import { describe, expect, it } from "vitest";
import { foldForSearch } from "canopui";
import { projectMatchesSearch } from "./projectSearch";
import { PROJECTS, getDocProjects, getStoreApps } from "../data/projects";
import type { Project, SectionSlug } from "../data/types";

const ALL_SECTION_SLUGS: SectionSlug[] = ["hobbies", "custhome", "toolbox"];

const projet = (surcharge: Partial<Project>): Project => ({
  id: "projet-test",
  section: "toolbox",
  name: "Projet Test",
  description: "Description neutre",
  docPath: "QVL/Projet/README.md",
  ...surcharge,
});

const cherche = (project: Project, requete: string) =>
  projectMatchesSearch(project, foldForSearch(requete));

describe("projectMatchesSearch - correspondance sur le nom", () => {
  it("trouve un nom accentué depuis une saisie sans accent", () => {
    const departemental = projet({ name: "DéparteMental" });

    expect(cherche(departemental, "departemental")).toBe(true);
  });

  it("trouve un nom à séparateurs depuis une saisie à espaces", () => {
    const portalDrive = projet({ name: "CH-Portal-Drive" });

    expect(cherche(portalDrive, "ch portal")).toBe(true);
  });

  it("ignore la casse de la saisie", () => {
    const portalDrive = projet({ name: "CH-Portal-Drive" });

    expect(cherche(portalDrive, "CH PORTAL")).toBe(true);
    expect(cherche(portalDrive, "ch portal")).toBe(true);
    expect(cherche(portalDrive, "Ch PoRtAl")).toBe(true);
  });

  it("ignore la casse du nom du projet", () => {
    expect(cherche(projet({ name: "BUDGY" }), "budgy")).toBe(true);
    expect(cherche(projet({ name: "budgy" }), "BUDGY")).toBe(true);
  });
});

describe("projectMatchesSearch - correspondance sur la tagline", () => {
  it("trouve un projet par un mot présent uniquement dans sa tagline", () => {
    const app = projet({
      name: "Budgy",
      tagline: "Pilotage du budget familial",
      description: "Description neutre",
    });

    expect(cherche(app, "familial")).toBe(true);
  });

  it("trouve une tagline accentuée depuis une saisie sans accent", () => {
    const app = projet({ tagline: "Générateur de séquences" });

    expect(cherche(app, "generateur")).toBe(true);
  });
});

describe("projectMatchesSearch - correspondance sur la description", () => {
  it("trouve un projet par un mot présent uniquement dans sa description", () => {
    const app = projet({
      name: "Budgy",
      tagline: "Pilotage du budget",
      description: "Suivi des dépenses mensuelles",
    });

    expect(cherche(app, "mensuelles")).toBe(true);
  });

  it("trouve une description accentuée depuis une saisie sans accent", () => {
    const app = projet({ description: "Suivi des dépenses" });

    expect(cherche(app, "depenses")).toBe(true);
  });
});

describe("projectMatchesSearch - cas limites", () => {
  it("accepte tout projet pour une requête vide", () => {
    expect(cherche(projet({}), "")).toBe(true);
    expect(cherche(projet({ tagline: undefined }), "")).toBe(true);
  });

  it("accepte tout projet pour une requête réduite à des séparateurs", () => {
    expect(cherche(projet({}), "   ")).toBe(true);
    expect(cherche(projet({}), "---")).toBe(true);
  });

  it("ne plante pas sur un projet sans tagline", () => {
    const horsStore = projet({ name: "CH-Relay", tagline: undefined });

    expect(() => cherche(horsStore, "relay")).not.toThrow();
    expect(cherche(horsStore, "relay")).toBe(true);
  });

  it("ne plante pas sur un projet sans tagline dont la requête ne correspond pas", () => {
    const horsStore = projet({ name: "CH-Relay", tagline: undefined });

    expect(cherche(horsStore, "budgy")).toBe(false);
  });

  it("ne plante sur aucun projet réel du catalogue", () => {
    PROJECTS.forEach((project) => {
      expect(() => cherche(project, "a"), `échec sur ${project.id}`).not.toThrow();
    });
  });
});

describe("projectMatchesSearch - absence de correspondance", () => {
  it("rejette une requête absente du nom, de la tagline et de la description", () => {
    const app = projet({
      name: "Budgy",
      tagline: "Pilotage du budget",
      description: "Suivi des dépenses",
    });

    expect(cherche(app, "cartographie")).toBe(false);
  });
});

describe("projectMatchesSearch - règle unique pour l'accueil et l'index de la doc", () => {
  const motSignificatif = (texte: string) =>
    foldForSearch(texte)
      .split(" ")
      .find((mot) => mot.length > 4);

  it("retrouve par sa tagline chaque projet de l'index de la doc qui en possède une", () => {
    const docAvecTagline = getDocProjects().filter(
      (project) => (project.tagline ?? "").trim() !== "",
    );

    expect(docAvecTagline.length).toBeGreaterThan(0);

    docAvecTagline.forEach((project) => {
      const mot = motSignificatif(project.tagline ?? "");

      if (mot === undefined) {
        return;
      }

      expect(
        projectMatchesSearch(project, mot),
        `${project.id} introuvable dans la doc par « ${mot} »`,
      ).toBe(true);
    });
  });

  it("retrouve par sa tagline chaque app du store qui en possède une", () => {
    const storeAvecTagline = ALL_SECTION_SLUGS.flatMap((slug) => getStoreApps(slug)).filter(
      (project) => (project.tagline ?? "").trim() !== "",
    );

    expect(storeAvecTagline.length).toBeGreaterThan(0);

    storeAvecTagline.forEach((project) => {
      const mot = motSignificatif(project.tagline ?? "");

      if (mot === undefined) {
        return;
      }

      expect(
        projectMatchesSearch(project, mot),
        `${project.id} introuvable dans le store par « ${mot} »`,
      ).toBe(true);
    });
  });

  it("retrouve par sa description chaque projet de l'index de la doc", () => {
    getDocProjects().forEach((project) => {
      const mot = motSignificatif(project.description);

      if (mot === undefined) {
        return;
      }

      expect(
        projectMatchesSearch(project, mot),
        `${project.id} introuvable dans la doc par « ${mot} »`,
      ).toBe(true);
    });
  });
});
