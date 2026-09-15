import { describe, expect, it } from "vitest";
import { canopBaseMessages, createTranslate, foldForSearch } from "canopui";
import type { CanopLocale, CanopTranslate } from "canopui";
import { projectMatchesSearch } from "./projectSearch";
import { PROJECTS, getDocProjects, getStoreApps } from "../data/projects";
import fr from "../i18n/locales/fr.json";
import en from "../i18n/locales/en.json";
import type { Project, SectionSlug } from "../data/types";

const ALL_SECTION_SLUGS: SectionSlug[] = ["hobbies", "custhome", "toolbox"];
const PROJET_TEST_ID = "projet-test";

const LANGUES: ReadonlyArray<readonly [CanopLocale, Record<string, string>]> = [
  ["fr", fr as Record<string, string>],
  ["en", en as Record<string, string>],
];

const traducteurDeLangue = (locale: CanopLocale, messages: Record<string, string>): CanopTranslate =>
  createTranslate({ ...canopBaseMessages[locale], ...messages }, locale);

const traducteur = (textes: Record<string, string> = {}): CanopTranslate =>
  createTranslate(textes, "fr");

const projet = (surcharge: Partial<Project> = {}): Project => ({
  id: PROJET_TEST_ID,
  section: "toolbox",
  name: "Projet Test",
  docPath: "QVL/Projet/README.md",
  ...surcharge,
});

const textesDuProjet = (tagline?: string, description?: string): Record<string, string> => ({
  ...(tagline === undefined ? {} : { [`projects.${PROJET_TEST_ID}.tagline`]: tagline }),
  ...(description === undefined ? {} : { [`projects.${PROJET_TEST_ID}.description`]: description }),
});

const cherche = (t: CanopTranslate, project: Project, requete: string) =>
  projectMatchesSearch(t, project, foldForSearch(requete));

describe("projectMatchesSearch - correspondance sur le nom", () => {
  const t = traducteur(textesDuProjet("Tagline neutre", "Description neutre"));

  it("trouve un nom accentué depuis une saisie sans accent", () => {
    expect(cherche(t, projet({ name: "DéparteMental" }), "departemental")).toBe(true);
  });

  it("trouve un nom à séparateurs depuis une saisie à espaces", () => {
    expect(cherche(t, projet({ name: "CH-Portal-Drive" }), "ch portal")).toBe(true);
  });

  it("ignore la casse de la saisie", () => {
    const portalDrive = projet({ name: "CH-Portal-Drive" });

    expect(cherche(t, portalDrive, "CH PORTAL")).toBe(true);
    expect(cherche(t, portalDrive, "ch portal")).toBe(true);
    expect(cherche(t, portalDrive, "Ch PoRtAl")).toBe(true);
  });

  it("ignore la casse du nom du projet", () => {
    expect(cherche(t, projet({ name: "BUDGY" }), "budgy")).toBe(true);
    expect(cherche(t, projet({ name: "budgy" }), "BUDGY")).toBe(true);
  });
});

describe("projectMatchesSearch - correspondance sur la tagline traduite", () => {
  it("trouve un projet par un mot présent uniquement dans sa tagline", () => {
    const t = traducteur(textesDuProjet("Pilotage du budget familial", "Description neutre"));

    expect(cherche(t, projet({ name: "Budgy" }), "familial")).toBe(true);
  });

  it("trouve une tagline accentuée depuis une saisie sans accent", () => {
    const t = traducteur(textesDuProjet("Générateur de séquences", "Description neutre"));

    expect(cherche(t, projet(), "generateur")).toBe(true);
  });
});

describe("projectMatchesSearch - correspondance sur la description traduite", () => {
  it("trouve un projet par un mot présent uniquement dans sa description", () => {
    const t = traducteur(textesDuProjet("Pilotage du budget", "Suivi des dépenses mensuelles"));

    expect(cherche(t, projet({ name: "Budgy" }), "mensuelles")).toBe(true);
  });

  it("trouve une description accentuée depuis une saisie sans accent", () => {
    const t = traducteur(textesDuProjet("Tagline neutre", "Suivi des dépenses"));

    expect(cherche(t, projet(), "depenses")).toBe(true);
  });
});

describe("projectMatchesSearch - la recherche suit la langue affichée", () => {
  const projetBilingue = projet({ name: "Projet Test" });
  const tFrancais = traducteur(textesDuProjet("Suivi des dépenses", "Pilotage du budget"));
  const tAnglais = createTranslate(textesDuProjet("Expense tracking", "Budget steering"), "en");

  it("trouve le projet par un mot de la tagline française quand le français est affiché", () => {
    expect(cherche(tFrancais, projetBilingue, "depenses")).toBe(true);
    expect(cherche(tFrancais, projetBilingue, "expense")).toBe(false);
  });

  it("trouve le projet par un mot de la tagline anglaise quand l'anglais est affiché", () => {
    expect(cherche(tAnglais, projetBilingue, "expense")).toBe(true);
    expect(cherche(tAnglais, projetBilingue, "depenses")).toBe(false);
  });
});

describe("projectMatchesSearch - cas limites", () => {
  const t = traducteur(textesDuProjet("Tagline neutre", "Description neutre"));
  const sansTexte = traducteur();

  it("accepte tout projet pour une requête vide", () => {
    expect(cherche(t, projet(), "")).toBe(true);
    expect(cherche(sansTexte, projet(), "")).toBe(true);
  });

  it("accepte tout projet pour une requête réduite à des séparateurs", () => {
    expect(cherche(t, projet(), "   ")).toBe(true);
    expect(cherche(t, projet(), "---")).toBe(true);
  });

  it("ne plante pas sur un projet sans tagline traduite", () => {
    const horsStore = projet({ name: "CH-Relay" });
    const tSansTagline = traducteur(textesDuProjet(undefined, "Relais de messages"));

    expect(() => cherche(tSansTagline, horsStore, "relay")).not.toThrow();
    expect(cherche(tSansTagline, horsStore, "relay")).toBe(true);
  });

  it("ne plante pas sur un projet sans tagline dont la requête ne correspond pas", () => {
    const horsStore = projet({ name: "CH-Relay" });
    const tSansTagline = traducteur(textesDuProjet(undefined, "Relais de messages"));

    expect(cherche(tSansTagline, horsStore, "budgy")).toBe(false);
  });

  it("ne plante sur aucun projet réel du catalogue dans aucune langue", () => {
    LANGUES.forEach(([locale, messages]) => {
      const tLangue = traducteurDeLangue(locale, messages);

      PROJECTS.forEach((project) => {
        expect(
          () => cherche(tLangue, project, "a"),
          `échec sur ${project.id} en ${locale}`,
        ).not.toThrow();
      });
    });
  });
});

describe("projectMatchesSearch - absence de correspondance", () => {
  it("rejette une requête absente du nom, de la tagline et de la description", () => {
    const t = traducteur(textesDuProjet("Pilotage du budget", "Suivi des dépenses"));

    expect(cherche(t, projet({ name: "Budgy" }), "cartographie")).toBe(false);
  });
});

describe("projectMatchesSearch - règle unique pour l'accueil et l'index de la doc", () => {
  const motSignificatif = (texte: string) =>
    foldForSearch(texte)
      .split(" ")
      .find((mot) => mot.length > 4);

  LANGUES.forEach(([locale, messages]) => {
    const t = traducteurDeLangue(locale, messages);
    const tagline = (project: Project) => messages[`projects.${project.id}.tagline`] ?? "";
    const description = (project: Project) => messages[`projects.${project.id}.description`] ?? "";

    describe(`en ${locale}`, () => {
      it("retrouve par sa tagline chaque projet de l'index de la doc qui en possède une", () => {
        const docAvecTagline = getDocProjects().filter((project) => tagline(project).trim() !== "");

        expect(docAvecTagline.length).toBeGreaterThan(0);

        docAvecTagline.forEach((project) => {
          const mot = motSignificatif(tagline(project));

          if (mot === undefined) {
            return;
          }

          expect(
            projectMatchesSearch(t, project, mot),
            `${project.id} introuvable dans la doc par « ${mot} » en ${locale}`,
          ).toBe(true);
        });
      });

      it("retrouve par sa tagline chaque app du store qui en possède une", () => {
        const storeAvecTagline = ALL_SECTION_SLUGS.flatMap((slug) => getStoreApps(slug)).filter(
          (project) => tagline(project).trim() !== "",
        );

        expect(storeAvecTagline.length).toBeGreaterThan(0);

        storeAvecTagline.forEach((project) => {
          const mot = motSignificatif(tagline(project));

          if (mot === undefined) {
            return;
          }

          expect(
            projectMatchesSearch(t, project, mot),
            `${project.id} introuvable dans le store par « ${mot} » en ${locale}`,
          ).toBe(true);
        });
      });

      it("retrouve par sa description chaque projet de l'index de la doc", () => {
        getDocProjects().forEach((project) => {
          const mot = motSignificatif(description(project));

          if (mot === undefined) {
            return;
          }

          expect(
            projectMatchesSearch(t, project, mot),
            `${project.id} introuvable dans la doc par « ${mot} » en ${locale}`,
          ).toBe(true);
        });
      });
    });
  });
});
