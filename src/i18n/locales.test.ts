import { describe, expect, it } from "vitest";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import { SECTIONS, PROJECTS, getStoreApps, getDocProjects } from "../data/projects";
import type { SectionSlug } from "../data/types";

const ALL_SECTION_SLUGS: SectionSlug[] = ["hobbies", "custhome", "toolbox"];

const CATALOGUES: ReadonlyArray<readonly [string, Record<string, string>]> = [
  ["fr", fr as Record<string, string>],
  ["en", en as Record<string, string>],
];

const cles = (catalogue: Record<string, string>) => Object.keys(catalogue).sort();

const variables = (valeur: string) =>
  [...valeur.matchAll(/\{(\w+)\}/g)].map((occurrence) => occurrence[1]).sort();

const storeApps = () => ALL_SECTION_SLUGS.flatMap((slug) => getStoreApps(slug));

describe("parité des fichiers de langue", () => {
  it("expose exactement le même jeu de clés en français et en anglais", () => {
    expect(cles(fr as Record<string, string>)).toEqual(cles(en as Record<string, string>));
  });

  it("ne laisse aucune clé française sans traduction anglaise", () => {
    const manquantes = Object.keys(fr).filter((cle) => !(cle in en));

    expect(manquantes).toEqual([]);
  });

  it("ne laisse aucune clé anglaise orpheline côté français", () => {
    const orphelines = Object.keys(en).filter((cle) => !(cle in fr));

    expect(orphelines).toEqual([]);
  });

  it("ne contient aucune valeur vide", () => {
    CATALOGUES.forEach(([langue, catalogue]) => {
      Object.entries(catalogue).forEach(([cle, valeur]) => {
        expect(valeur.trim(), `valeur vide pour ${cle} en ${langue}`).not.toBe("");
      });
    });
  });

  it("conserve les mêmes variables d'interpolation dans les deux langues", () => {
    Object.keys(fr as Record<string, string>).forEach((cle) => {
      const valeurFr = (fr as Record<string, string>)[cle] ?? "";
      const valeurEn = (en as Record<string, string>)[cle] ?? "";

      expect(variables(valeurEn), `variables divergentes pour ${cle}`).toEqual(variables(valeurFr));
    });
  });
});

describe("couverture des textes du catalogue par les fichiers de langue", () => {
  it("couvre au moins une app du store", () => {
    expect(storeApps().length).toBeGreaterThan(0);
  });

  it("traduit la description de chaque app du store dans les deux langues", () => {
    CATALOGUES.forEach(([langue, catalogue]) => {
      storeApps().forEach((app) => {
        const description = catalogue[`projects.${app.id}.description`];

        expect(description?.trim(), `description manquante pour ${app.id} en ${langue}`).not.toBe(
          "",
        );
        expect(description, `description manquante pour ${app.id} en ${langue}`).toBeDefined();
      });
    });
  });

  it("traduit la description de chaque projet de l'index de la doc dans les deux langues", () => {
    CATALOGUES.forEach(([langue, catalogue]) => {
      getDocProjects().forEach((project) => {
        const description = catalogue[`projects.${project.id}.description`];

        expect(
          description,
          `description manquante pour ${project.id} en ${langue}`,
        ).toBeDefined();
        expect(
          description?.trim(),
          `description vide pour ${project.id} en ${langue}`,
        ).not.toBe("");
      });
    });
  });

  it("traduit la tagline de chaque section dans les deux langues", () => {
    CATALOGUES.forEach(([langue, catalogue]) => {
      SECTIONS.forEach((section) => {
        const tagline = catalogue[`sections.${section.slug}.tagline`];

        expect(tagline, `tagline manquante pour la section ${section.slug} en ${langue}`).toBeDefined();
        expect(tagline?.trim(), `tagline vide pour la section ${section.slug} en ${langue}`).not.toBe(
          "",
        );
      });
    });
  });
});

describe("absence de clés orphelines dans les fichiers de langue", () => {
  const idsConnus = new Set(PROJECTS.map((project) => project.id));
  const slugsConnus = new Set(SECTIONS.map((section) => section.slug));

  it("ne déclare aucun texte de projet inconnu du catalogue", () => {
    CATALOGUES.forEach(([langue, catalogue]) => {
      const inconnus = Object.keys(catalogue)
        .filter((cle) => cle.startsWith("projects."))
        .map((cle) => cle.split(".")[1] ?? "")
        .filter((id) => !idsConnus.has(id));

      expect([...new Set(inconnus)], `projets inconnus en ${langue}`).toEqual([]);
    });
  });

  it("ne déclare aucun texte de section inconnue du catalogue", () => {
    CATALOGUES.forEach(([langue, catalogue]) => {
      const inconnus = Object.keys(catalogue)
        .filter((cle) => cle.startsWith("sections."))
        .map((cle) => cle.split(".")[1] ?? "")
        .filter((slug) => !slugsConnus.has(slug as SectionSlug));

      expect([...new Set(inconnus)], `sections inconnues en ${langue}`).toEqual([]);
    });
  });
});
