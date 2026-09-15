import { describe, expect, it } from "vitest";
import { monogramTone, toInitials } from "./useProjectLogo";

describe("toInitials (fallback logo)", () => {
  it("prend les deux premières majuscules d'un nom en CamelCase", () => {
    expect(toInitials("CanopUI")).toBe("CU");
    expect(toInitials("PipeBoard")).toBe("PB");
    expect(toInitials("TrailLog")).toBe("TL");
  });

  it("agrège les majuscules des noms composés", () => {
    expect(toInitials("CH-Api-Budgy")).toBe("CH");
  });

  it("retire le préfixe QVL- pour des initiales plus parlantes", () => {
    expect(toInitials("QVL-Studio")).toBe("ST");
    expect(toInitials("QVL-ToolBox")).toBe("TB");
    expect(toInitials("QVL-CustHome")).toBe("CH");
  });

  it("bascule sur les premières lettres quand il n'y a pas assez de majuscules", () => {
    expect(toInitials("Tools")).toBe("TO");
    expect(toInitials("budgy")).toBe("BU");
  });

  it("ignore les caractères non alphanumériques du repli", () => {
    expect(toInitials("a-b")).toBe("AB");
  });
});

describe("monogramTone (couleur du monogramme)", () => {
  it("renvoie toujours la même tonalité pour un même identifiant", () => {
    ["ch-tools", "statbar", "departemental", "fonddeshaker"].forEach((id) => {
      expect(monogramTone(id)).toEqual(monogramTone(id));
    });
  });

  it("renvoie une tonalité stable sur plusieurs appels consécutifs", () => {
    const appels = Array.from({ length: 50 }, () => monogramTone("ch-portal-drive"));

    appels.forEach((tone) => {
      expect(tone).toEqual(appels[0]);
    });
  });

  it("expose toujours un fond et une couleur de texte non vides", () => {
    ["", "a", "ch-tools", "un-identifiant-tres-long-pour-le-hash"].forEach((id) => {
      const tone = monogramTone(id);

      expect(tone.background.trim()).not.toBe("");
      expect(tone.color.trim()).not.toBe("");
    });
  });

  it("répartit les identifiants sur plusieurs tonalités", () => {
    const ids = ["statbar", "departemental", "fonddeshaker", "ch-tools", "ch-portal-drive", "budgy"];
    const fonds = new Set(ids.map((id) => monogramTone(id).background));

    expect(fonds.size).toBeGreaterThan(1);
  });
});
