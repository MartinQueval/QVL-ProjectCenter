import { describe, expect, it } from "vitest";
import {
  getSectionHomeProjects,
  getSectionTree,
  getSectionProjects,
} from "./projects";

describe("getSectionHomeProjects", () => {
  it("studio expose la vue d'ensemble QVL-Studio (doc interne)", () => {
    const home = getSectionHomeProjects("studio");
    expect(home.map((project) => project.id)).toEqual(["studio"]);
    expect(home[0]?.url).toBeUndefined();
  });

  it("hobbies expose TrailLog", () => {
    expect(getSectionHomeProjects("hobbies").map((project) => project.id)).toEqual(["traillog"]);
  });

  it("toolbox expose 2 portails : PipeBoard puis la vitrine CanopUI", () => {
    const home = getSectionHomeProjects("toolbox");
    expect(home.map((project) => project.id)).toEqual(["pipeboard", "canopui"]);
    expect(home.find((project) => project.id === "pipeboard")?.url).toBe(
      "https://tb-pipeboard.qvl-project.com",
    );
    expect(home.find((project) => project.id === "canopui")?.url).toBe(
      "https://canopui.qvl-project.com",
    );
  });

  it("custhome expose 4 portails dans l'ordre Authenticator, Admin, Drive, Budgy", () => {
    const home = getSectionHomeProjects("custhome");
    expect(home.map((project) => project.id)).toEqual([
      "ch-portal-authenticator",
      "ch-portail-admin",
      "ch-portal-drive",
      "ch-portal-budgy",
    ]);
  });

  it("toutes les cartes home hébergées pointent vers une URL externe https", () => {
    const hosted = [
      ...getSectionHomeProjects("toolbox"),
      ...getSectionHomeProjects("custhome"),
    ];
    for (const project of hosted) {
      expect(project.url?.startsWith("https://")).toBe(true);
    }
  });

  it("les URLs publiques des portails CustHome correspondent aux sous-domaines déployés", () => {
    const byId = Object.fromEntries(
      getSectionHomeProjects("custhome").map((project) => [project.id, project.url]),
    );
    expect(byId["ch-portal-authenticator"]).toBe("https://ch-auth.qvl-project.com");
    expect(byId["ch-portail-admin"]).toBe("https://ch-admin.qvl-project.com");
    expect(byId["ch-portal-drive"]).toBe("https://ch-drive.qvl-project.com");
    expect(byId["ch-portal-budgy"]).toBe("https://ch-budgy.qvl-project.com");
  });
});

describe("getSectionTree (navigation docs inchangée)", () => {
  it("conserve les vues d'ensemble ToolBox/CustHome avec leurs sous-items", () => {
    const toolbox = getSectionTree("toolbox");
    expect(toolbox).toHaveLength(1);
    expect(toolbox[0]?.project.id).toBe("toolbox");
    expect(toolbox[0]?.children.length).toBeGreaterThan(0);

    const custhome = getSectionTree("custhome");
    expect(custhome[0]?.project.id).toBe("custhome");
    expect(custhome[0]?.children.some((child) => child.id === "ch-api-gateway")).toBe(true);
  });

  it("garde toutes les entrées de section accessibles en doc (dont les non-home)", () => {
    const toolboxIds = getSectionProjects("toolbox").map((project) => project.id);
    expect(toolboxIds).toContain("aigate");
    expect(toolboxIds).toContain("switch");
  });
});
