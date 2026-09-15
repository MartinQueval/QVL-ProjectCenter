import { describe, expect, it } from "vitest";
import {
  SECTIONS,
  PROJECTS,
  getStoreSections,
  getStoreApps,
  getDocProjects,
  getSection,
  getProject,
} from "./projects";
import type { SectionSlug } from "./types";

const TAGLINE_MAX_LENGTH = 80;
const ALL_SECTION_SLUGS: SectionSlug[] = ["hobbies", "custhome", "toolbox"];

const projetsDeSection = (slug: SectionSlug) =>
  PROJECTS.filter((project) => project.section === slug);
const storeApps = () => PROJECTS.filter((project) => project.store === true);
const nonStoreProjects = () => PROJECTS.filter((project) => project.store !== true);
const idsOf = <T extends { id: string }>(items: readonly T[]) => items.map((item) => item.id);
const slugsOf = <T extends { slug: string }>(items: readonly T[]) => items.map((item) => item.slug);

describe("AC1 - suppression de studio et traillog", () => {
  it("ne référence plus la section studio dans SECTIONS", () => {
    const slugs = slugsOf(SECTIONS);

    expect(slugs).not.toContain("studio");
  });

  it("ne référence plus les projets studio et traillog dans PROJECTS", () => {
    const ids = idsOf(PROJECTS);

    expect(ids).not.toContain("studio");
    expect(ids).not.toContain("traillog");
  });

  it("ne rattache aucun projet à une section studio", () => {
    const sectionsUtilisees = PROJECTS.map((project) => project.section);

    expect(sectionsUtilisees).not.toContain("studio");
  });

  it("ne résout plus studio ni traillog via les sélecteurs unitaires", () => {
    expect(getSection("studio" as SectionSlug)).toBeUndefined();
    expect(getProject("studio")).toBeUndefined();
    expect(getProject("traillog")).toBeUndefined();
  });

  it("ne rattache aucun projet à un parent supprimé", () => {
    const parentIds = PROJECTS.map((project) => project.parentId).filter(
      (parentId): parentId is string => Boolean(parentId),
    );

    expect(parentIds).not.toContain("studio");
    expect(parentIds).not.toContain("traillog");
  });
});

describe("AC2 - ordre des sections du store", () => {
  it("renvoie les sections triées par order", () => {
    const slugs = slugsOf(getStoreSections());

    expect(slugs).toEqual(["hobbies", "custhome", "toolbox"]);
  });

  it("place toolbox en dernière position", () => {
    const slugs = slugsOf(getStoreSections());

    expect(slugs[slugs.length - 1]).toBe("toolbox");
  });

  it("expose des order strictement croissants", () => {
    const orders = getStoreSections().map((section) => section.order);
    const tries = [...orders].sort((a, b) => a - b);

    expect(orders).toEqual(tries);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("ne renvoie aucune section inconnue", () => {
    const slugs = slugsOf(getStoreSections());

    slugs.forEach((slug) => {
      expect(ALL_SECTION_SLUGS).toContain(slug);
    });
  });
});

describe("AC3 - hobbies en vedette et en première position", () => {
  it("marque hobbies comme featured", () => {
    const hobbies = getSection("hobbies");

    expect(hobbies).toBeDefined();
    expect(hobbies?.featured).toBe(true);
  });

  it("place hobbies en première position du store", () => {
    expect(slugsOf(getStoreSections())[0]).toBe("hobbies");
  });

  it("ne met en avant qu'une seule section", () => {
    const featured = getStoreSections().filter((section) => section.featured === true);

    expect(slugsOf(featured)).toEqual(["hobbies"]);
  });
});

describe("AC4 - composition du store custhome", () => {
  it("place ch-portal-budgy en dernière position des apps custhome", () => {
    const ids = idsOf(getStoreApps("custhome"));

    expect(ids[ids.length - 1]).toBe("ch-portal-budgy");
  });

  it("exclut ch-tools du store custhome", () => {
    expect(idsOf(getStoreApps("custhome"))).not.toContain("ch-tools");
  });

  it("ne renvoie que des apps de la section custhome", () => {
    getStoreApps("custhome").forEach((app) => {
      expect(app.section).toBe("custhome");
    });
  });

  it("ne renvoie que des apps marquées store", () => {
    ALL_SECTION_SLUGS.forEach((slug) => {
      getStoreApps(slug).forEach((app) => {
        expect(app.store).toBe(true);
      });
    });
  });

  it("renvoie un tableau vide pour une section inconnue", () => {
    expect(getStoreApps("studio" as SectionSlug)).toEqual([]);
  });
});

describe("AC5 - tagline obligatoire et bornée pour les apps du store", () => {
  it("définit une tagline non vide pour chaque app du store", () => {
    storeApps().forEach((app) => {
      expect(app.tagline, `tagline manquante pour ${app.id}`).toBeDefined();
      expect(app.tagline?.trim(), `tagline vide pour ${app.id}`).not.toBe("");
    });
  });

  it("limite chaque tagline du store à 80 caractères", () => {
    storeApps().forEach((app) => {
      expect(
        app.tagline?.length ?? 0,
        `tagline trop longue pour ${app.id} (${app.tagline?.length})`,
      ).toBeLessThanOrEqual(TAGLINE_MAX_LENGTH);
    });
  });

  it("couvre au moins une app du store", () => {
    expect(storeApps().length).toBeGreaterThan(0);
  });
});

describe("AC6 - unicité des identifiants de projet", () => {
  it("n'expose aucun id dupliqué dans PROJECTS", () => {
    const ids = idsOf(PROJECTS);
    const doublons = ids.filter((id, index) => ids.indexOf(id) !== index);

    expect(doublons).toEqual([]);
  });

  it("n'expose aucun slug dupliqué dans SECTIONS", () => {
    const slugs = slugsOf(SECTIONS);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("résout chaque id vers un projet unique", () => {
    PROJECTS.forEach((project) => {
      expect(getProject(project.id)?.id).toBe(project.id);
    });
  });

  it("résout chaque id indépendamment de sa section", () => {
    const ids = idsOf(PROJECTS);
    const resolus = ids.map((id) => getProject(id)).filter((project) => project !== undefined);

    expect(resolus).toHaveLength(ids.length);
    expect(new Set(resolus.map((project) => project.section)).size).toBeGreaterThan(0);
  });

  it("n'expose aucun id vide", () => {
    PROJECTS.forEach((project) => {
      expect(project.id.trim()).not.toBe("");
    });
  });
});

describe("AC7 - protocole des urls du store", () => {
  it("utilise https pour chaque app du store qui déclare une url", () => {
    storeApps()
      .filter((app) => app.url !== undefined)
      .forEach((app) => {
        expect(app.url, `url non https pour ${app.id}`).toMatch(/^https:\/\//);
      });
  });

  it("déclare une url pour chaque app du store", () => {
    expect(storeApps().length).toBeGreaterThan(0);

    storeApps().forEach((app) => {
      expect(app.url, `url manquante pour ${app.id}`).toBeDefined();
      expect(app.url?.trim(), `url vide pour ${app.id}`).not.toBe("");
    });
  });

  it("n'expose aucune url vide", () => {
    PROJECTS.filter((project) => project.url !== undefined).forEach((project) => {
      expect(project.url?.trim(), `url vide pour ${project.id}`).not.toBe("");
    });
  });
});

describe("AC8 - docPath purgés des projets supprimés", () => {
  it("ne référence plus projets/TrailLog/", () => {
    PROJECTS.forEach((project) => {
      expect(project.docPath, `docPath obsolète pour ${project.id}`).not.toContain(
        "projets/TrailLog/",
      );
    });
  });

  it("ne référence plus QVL-Studio/", () => {
    PROJECTS.forEach((project) => {
      expect(project.docPath, `docPath obsolète pour ${project.id}`).not.toContain(
        "QVL-Studio/",
      );
    });
  });
});

describe("AC9 - la documentation ne perd aucun projet hors store", () => {
  it("expose chaque projet absent du store dans getDocProjects", () => {
    const docIds = idsOf(getDocProjects());

    nonStoreProjects().forEach((project) => {
      expect(docIds, `projet hors store absent de la doc : ${project.id}`).toContain(
        project.id,
      );
    });
  });

  it("documente au moins un projet hors store pour chaque section", () => {
    const docHorsStore = getDocProjects().filter((project) => project.store !== true);

    ALL_SECTION_SLUGS.forEach((slug) => {
      const projetsDeLaSection = docHorsStore.filter(
        (project) => project.section === slug,
      );

      expect(
        projetsDeLaSection.length,
        `aucun projet documenté hors store pour ${slug}`,
      ).toBeGreaterThan(0);
    });
  });

  it("documente les deux apis de la section hobbies", () => {
    const hobbiesHorsStore = getDocProjects().filter(
      (project) => project.section === "hobbies" && project.store !== true,
    );

    expect(hobbiesHorsStore.length).toBeGreaterThanOrEqual(2);
  });

  it("ne documente que des projets connus de PROJECTS", () => {
    const ids = idsOf(PROJECTS);

    getDocProjects().forEach((project) => {
      expect(ids).toContain(project.id);
    });
  });

  it("n'expose aucun doublon dans getDocProjects", () => {
    const docIds = idsOf(getDocProjects());

    expect(new Set(docIds).size).toBe(docIds.length);
  });
});

describe("AC10 - les sélecteurs ne mutent pas les sources", () => {
  it("préserve l'ordre de SECTIONS après appel de getStoreSections", () => {
    const avant = slugsOf(SECTIONS);

    getStoreSections();

    expect(slugsOf(SECTIONS)).toEqual(avant);
  });

  it("préserve l'ordre de PROJECTS après appel des sélecteurs", () => {
    const avant = idsOf(PROJECTS);

    ALL_SECTION_SLUGS.forEach((slug) => {
      getStoreApps(slug);
    });
    getDocProjects();

    expect(idsOf(PROJECTS)).toEqual(avant);
  });

  it("renvoie le même ordre de sections à chaque appel", () => {
    expect(slugsOf(getStoreSections())).toEqual(slugsOf(getStoreSections()));
  });

  it("renvoie le même ordre d'apps à chaque appel", () => {
    ALL_SECTION_SLUGS.forEach((slug) => {
      expect(idsOf(getStoreApps(slug))).toEqual(idsOf(getStoreApps(slug)));
    });
  });

  it("renvoie une nouvelle référence de tableau à chaque appel", () => {
    expect(getStoreSections()).not.toBe(getStoreSections());
    expect(getStoreApps("custhome")).not.toBe(getStoreApps("custhome"));
    expect(getDocProjects()).not.toBe(getDocProjects());
  });
});

describe("AC11 - format des docPath", () => {
  it("définit un docPath non vide pour chaque projet", () => {
    PROJECTS.forEach((project) => {
      expect(project.docPath, `docPath manquant pour ${project.id}`).toBeDefined();
      expect(project.docPath.trim(), `docPath vide pour ${project.id}`).not.toBe("");
    });
  });

  it("n'utilise que des chemins relatifs", () => {
    PROJECTS.forEach((project) => {
      expect(
        project.docPath.startsWith("/"),
        `docPath absolu pour ${project.id} : ${project.docPath}`,
      ).toBe(false);
    });
  });
});

describe("AC12 - composition du catalogue", () => {
  it("expose 27 projets", () => {
    expect(PROJECTS).toHaveLength(27);
  });

  it("répartit les projets entre hobbies, custhome et toolbox", () => {
    expect(projetsDeSection("hobbies")).toHaveLength(6);
    expect(projetsDeSection("custhome")).toHaveLength(10);
    expect(projetsDeSection("toolbox")).toHaveLength(11);
  });

  it("couvre l'intégralité des projets avec les trois sections", () => {
    const parSection = ALL_SECTION_SLUGS.reduce(
      (total, slug) => total + projetsDeSection(slug).length,
      0,
    );

    expect(parSection).toBe(PROJECTS.length);
  });
});

describe("AC13 - suppression du doublon ch-relay", () => {
  it("ne référence plus ch-relay dans PROJECTS", () => {
    expect(idsOf(PROJECTS)).not.toContain("ch-relay");
  });

  it("ne résout plus ch-relay via getProject", () => {
    expect(getProject("ch-relay")).toBeUndefined();
  });

  it("ne documente plus ch-relay", () => {
    expect(idsOf(getDocProjects())).not.toContain("ch-relay");
  });

  it("ne rattache aucun projet à ch-relay", () => {
    const parentIds = PROJECTS.map((project) => project.parentId);

    expect(parentIds).not.toContain("ch-relay");
  });
});

describe("AC14 - ajout du projet projectcenter", () => {
  it("expose projectcenter dans le catalogue", () => {
    expect(getProject("projectcenter")).toBeDefined();
  });

  it("rattache projectcenter à la section toolbox", () => {
    expect(getProject("projectcenter")?.section).toBe("toolbox");
  });

  it("exclut projectcenter du store", () => {
    expect(getProject("projectcenter")?.store).toBe(false);
    expect(idsOf(getStoreApps("toolbox"))).not.toContain("projectcenter");
  });

  it("pointe projectcenter vers le README de son dépôt", () => {
    expect(getProject("projectcenter")?.docPath).toBe("QVL-ProjectCenter/README.md");
  });

  it("ordonne projectcenter en quatorzième position", () => {
    expect(getProject("projectcenter")?.order).toBe(14);
  });

  it("documente projectcenter malgré son absence du store", () => {
    expect(idsOf(getDocProjects())).toContain("projectcenter");
  });
});

describe("AC15 - apps du store par section", () => {
  it("expose les apps custhome dans l'ordre attendu", () => {
    expect(idsOf(getStoreApps("custhome"))).toEqual([
      "ch-portail-admin",
      "ch-portal-drive",
      "ch-portal-budgy",
    ]);
  });

  it("expose les apps toolbox dans l'ordre attendu", () => {
    expect(idsOf(getStoreApps("toolbox"))).toEqual(["pipeboard", "canopui"]);
  });

  it("expose les apps hobbies dans l'ordre attendu", () => {
    expect(idsOf(getStoreApps("hobbies"))).toEqual([
      "hb-front-statbar",
      "hb-front-fonddeshaker",
      "hb-front-departemental",
    ]);
  });

  it("n'expose aucune autre app dans le store", () => {
    const idsDuStore = ALL_SECTION_SLUGS.flatMap((slug) => idsOf(getStoreApps(slug)));

    expect(idsDuStore).toHaveLength(storeApps().length);
  });
});

describe("AC16 - raccourci de téléchargement conditionné à la présence d'une url", () => {
  it("déclare une url pour chaque app du store, toutes sections confondues", () => {
    ALL_SECTION_SLUGS.forEach((slug) => {
      getStoreApps(slug).forEach((app) => {
        expect(app.url, `url manquante pour ${app.id}`).toBeDefined();
      });
    });
  });

  it("n'expose dans le store aucune app privée d'url", () => {
    const sansUrl = storeApps().filter((app) => app.url === undefined);

    expect(idsOf(sansUrl)).toEqual([]);
  });
});

describe("AC18 - authenticator et tools hors store mais documentés", () => {
  const HORS_STORE_DOCUMENTES = ["ch-portal-authenticator", "ch-tools"];

  it("exclut ch-portal-authenticator et ch-tools du store", () => {
    HORS_STORE_DOCUMENTES.forEach((id) => {
      expect(getProject(id)?.store, `${id} encore dans le store`).toBe(false);
    });

    expect(idsOf(storeApps())).not.toContain("ch-portal-authenticator");
    expect(idsOf(storeApps())).not.toContain("ch-tools");
  });

  it("conserve ch-portal-authenticator et ch-tools dans la documentation", () => {
    const docIds = idsOf(getDocProjects());

    HORS_STORE_DOCUMENTES.forEach((id) => {
      expect(docIds, `${id} absent de la documentation`).toContain(id);
    });
  });

  it("conserve un docPath exploitable pour ch-portal-authenticator et ch-tools", () => {
    HORS_STORE_DOCUMENTES.forEach((id) => {
      const documente = getDocProjects().find((project) => project.id === id);

      expect(documente, `${id} introuvable dans getDocProjects`).toBeDefined();
      expect(documente?.docPath, `docPath manquant pour ${id}`).toBeDefined();
      expect(documente?.docPath.trim(), `docPath vide pour ${id}`).not.toBe("");
    });
  });

  it("conserve ch-portal-authenticator et ch-tools dans la section custhome", () => {
    HORS_STORE_DOCUMENTES.forEach((id) => {
      expect(getProject(id)?.section).toBe("custhome");
    });
  });
});

describe("AC17 - la documentation couvre tout le catalogue", () => {
  it("expose les 27 projets du catalogue", () => {
    expect(getDocProjects()).toHaveLength(PROJECTS.length);
  });

  it("n'omet aucun projet, du store ou non", () => {
    const docIds = idsOf(getDocProjects());

    idsOf(PROJECTS).forEach((id) => {
      expect(docIds, `projet absent de la documentation : ${id}`).toContain(id);
    });
  });

  it("rattache chaque projet documenté à une section connue", () => {
    getDocProjects().forEach((project) => {
      expect(ALL_SECTION_SLUGS).toContain(project.section);
    });
  });

  it("regroupe les projets documentés sur les trois sections", () => {
    ALL_SECTION_SLUGS.forEach((slug) => {
      const projetsDeLaSection = getDocProjects().filter(
        (project) => project.section === slug,
      );

      expect(projetsDeLaSection.length, `aucun projet documenté pour ${slug}`).toBeGreaterThan(0);
    });
  });
});
