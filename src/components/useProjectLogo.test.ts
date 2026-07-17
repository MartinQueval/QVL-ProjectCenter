import { describe, expect, it } from "vitest";
import { toInitials } from "./useProjectLogo";

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
