import { describe, expect, it } from "vitest";
import {
  addToHomeInstructions,
  buildShortcut,
  resolveShortcutMode,
  shortcutFormatForOs,
  toShortcutBaseName,
  toShortcutFileName,
} from "./desktopShortcut";
import type { PlatformInfo, PlatformOs, ShortcutFormat } from "./platform";

const URL_NUE = "https://x.com";
const URL_NORMALISEE = "https://x.com/";
const FORMATS: ShortcutFormat[] = ["url", "webloc", "desktop"];
const OS_BUREAU: PlatformOs[] = ["windows", "macos", "linux"];
const OS_SANS_FICHIER: PlatformOs[] = ["ios", "ipados", "android", "unknown"];
const TOUS_LES_OS: PlatformOs[] = [...OS_BUREAU, ...OS_SANS_FICHIER];
const CARACTERES_INTERDITS = /[<>:"/\\|?*]/;
const CARACTERES_DE_CONTROLE = /[\u0000-\u001f\u007f]/;

const platform = (os: PlatformOs, browser = "unknown"): PlatformInfo =>
  ({
    os,
    browser,
    isMobile: os === "ios" || os === "ipados" || os === "android",
  }) as PlatformInfo;

const lignes = (contenu: string) => contenu.split(/\r\n|\n/);

describe("buildShortcut - format url pour Windows", () => {
  it("produit exactement la section InternetShortcut en fins de ligne CRLF", () => {
    const shortcut = buildShortcut("ProjectCenter", URL_NUE, "url");

    expect(shortcut.content).toBe(`[InternetShortcut]\r\nURL=${URL_NORMALISEE}\r\n`);
  });

  it("n'écrit aucun saut de ligne qui ne soit précédé d'un retour chariot", () => {
    const shortcut = buildShortcut("ProjectCenter", "https://x.com/a?b=1#c", "url");

    expect(/(^|[^\r])\n/.test(shortcut.content)).toBe(false);
  });

  it("nomme le fichier avec l'extension url et annonce un type mime", () => {
    const shortcut = buildShortcut("ProjectCenter", URL_NUE, "url");

    expect(shortcut.fileName.endsWith(".url")).toBe(true);
    expect(shortcut.mimeType.trim()).not.toBe("");
  });
});

describe("buildShortcut - format webloc pour macOS", () => {
  it("produit un plist XML portant la clé URL", () => {
    const shortcut = buildShortcut("ProjectCenter", URL_NUE, "webloc");

    expect(shortcut.content).toContain("<?xml");
    expect(shortcut.content).toContain("<plist");
    expect(shortcut.content).toContain("<key>URL</key>");
    expect(shortcut.content).toContain(`<string>${URL_NORMALISEE}</string>`);
  });

  it("échappe les esperluettes d'une query string", () => {
    const shortcut = buildShortcut("ProjectCenter", "https://x.com/?a=1&b=2", "webloc");

    expect(shortcut.content).toContain("a=1&amp;b=2");
    expect(/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(shortcut.content)).toBe(false);
  });

  it("nomme le fichier avec l'extension webloc", () => {
    expect(buildShortcut("ProjectCenter", URL_NUE, "webloc").fileName.endsWith(".webloc")).toBe(
      true,
    );
  });
});

describe("buildShortcut - format desktop pour Linux", () => {
  it("produit une entrée de type Link avec le nom accentué", () => {
    const shortcut = buildShortcut("DéparteMental", URL_NUE, "desktop");

    expect(shortcut.content).toContain("[Desktop Entry]");
    expect(shortcut.content).toContain("Type=Link");
    expect(shortcut.content).toContain("Name=DéparteMental");
    expect(shortcut.content).toContain(`URL=${URL_NORMALISEE}`);
  });

  it("n'utilise que des fins de ligne LF", () => {
    const shortcut = buildShortcut("DéparteMental", URL_NUE, "desktop");

    expect(shortcut.content).not.toContain("\r");
  });

  it("nomme le fichier avec l'extension desktop", () => {
    expect(buildShortcut("ProjectCenter", URL_NUE, "desktop").fileName.endsWith(".desktop")).toBe(
      true,
    );
  });
});

describe("buildShortcut - normalisation de l'url", () => {
  it("normalise une url sans chemin en ajoutant la barre oblique finale", () => {
    FORMATS.forEach((format) => {
      expect(buildShortcut("ProjectCenter", URL_NUE, format).content).toContain(URL_NORMALISEE);
    });
  });

  it("conserve le port, la query et le fragment", () => {
    const shortcut = buildShortcut("ProjectCenter", "https://x.com:8443/doc?a=1#ancre", "url");

    expect(shortcut.content).toContain("https://x.com:8443/doc?a=1#ancre");
  });
});

describe("buildShortcut - résistance à l'injection de contenu", () => {
  const urlMalveillante = "https://x.com/\r\n[InternetShortcut]\r\nURL=https://evil";
  const sectionsDe = (contenu: string) => lignes(contenu).filter((ligne) => ligne.startsWith("["));
  const clesDe = (contenu: string) => lignes(contenu).filter((ligne) => /^[A-Za-z][\w-]*=/.test(ligne));

  it("ne laisse qu'une seule section dans un fichier url", () => {
    const shortcut = buildShortcut("ProjectCenter", urlMalveillante, "url");

    expect(sectionsDe(shortcut.content)).toEqual(["[InternetShortcut]"]);
    expect(clesDe(shortcut.content)).toHaveLength(1);
    expect(clesDe(shortcut.content)[0].startsWith("URL=")).toBe(true);
  });

  it("ne laisse qu'une seule section dans un fichier desktop", () => {
    const shortcut = buildShortcut(
      "ProjectCenter",
      "https://x.com/\n[Desktop Entry]\nExec=rm -rf",
      "desktop",
    );

    expect(sectionsDe(shortcut.content)).toEqual(["[Desktop Entry]"]);
    expect(clesDe(shortcut.content).some((ligne) => ligne.startsWith("Exec="))).toBe(false);
  });

  it("ne laisse aucune clé injectée par le nom dans un fichier desktop", () => {
    const shortcut = buildShortcut("Nom\nExec=rm -rf", URL_NUE, "desktop");

    expect(sectionsDe(shortcut.content)).toEqual(["[Desktop Entry]"]);
    expect(clesDe(shortcut.content).some((ligne) => ligne.startsWith("Exec="))).toBe(false);
  });

  it("ne laisse aucune balise injectée par l'url dans un fichier webloc", () => {
    const shortcut = buildShortcut("ProjectCenter", "https://x.com/</string><key>Evil</key>", "webloc");

    expect(shortcut.content).not.toContain("<key>Evil</key>");
    expect((shortcut.content.match(/<key>/g) ?? [])).toHaveLength(1);
  });
});

describe("buildShortcut - urls refusées", () => {
  const urlsRefusees = [
    "",
    "   ",
    "example.com",
    "/chemin",
    "//example.com",
    "http://x.com",
    "ftp://x",
    "javascript:alert(1)",
    "data:text/html,x",
  ];

  it("lève pour toute url qui n'est pas une url https absolue", () => {
    urlsRefusees.forEach((url) => {
      FORMATS.forEach((format) => {
        expect(
          () => buildShortcut("ProjectCenter", url, format),
          `url acceptée à tort : ${JSON.stringify(url)} (${format})`,
        ).toThrow();
      });
    });
  });

  it("accepte les urls https valides", () => {
    const urlsAcceptees = [
      "https://x.com",
      "https://x.com:8443/doc",
      "https://x.com/doc?a=1&b=2",
      "https://x.com/doc#ancre",
      "https://xn--dprtemental-p7a.fr/",
    ];

    urlsAcceptees.forEach((url) => {
      FORMATS.forEach((format) => {
        expect(
          () => buildShortcut("ProjectCenter", url, format),
          `url refusée à tort : ${url} (${format})`,
        ).not.toThrow();
      });
    });
  });
});

describe("toShortcutBaseName - assainissement du nom", () => {
  it("conserve les noms déjà valides et leurs accents", () => {
    expect(toShortcutBaseName("DéparteMental")).toBe("DéparteMental");
    expect(toShortcutBaseName("FondDeShaker")).toBe("FondDeShaker");
  });

  it("retire tous les caractères interdits par les systèmes de fichiers", () => {
    const base = toShortcutBaseName('A/B:C*D?E"F<G>H|I\\J');

    expect(base).not.toMatch(CARACTERES_INTERDITS);
    expect(base.trim()).not.toBe("");
  });

  it("remplace les caractères de contrôle", () => {
    const base = toShortcutBaseName("Nom\u0001Test\u001f");

    expect(base).not.toMatch(CARACTERES_DE_CONTROLE);
    expect(base).not.toMatch(CARACTERES_INTERDITS);
    expect(base.trim()).not.toBe("");
  });

  it("retombe sur raccourci quand il ne reste rien d'exploitable", () => {
    expect(toShortcutBaseName("   ")).toBe("raccourci");
    expect(toShortcutBaseName("///")).toBe("raccourci");
    expect(toShortcutBaseName("...")).toBe("raccourci");
    expect(toShortcutBaseName("")).toBe("raccourci");
  });

  it("ne produit jamais de fichier caché", () => {
    expect(toShortcutBaseName(".gitignore")).toBe("gitignore");
    expect(toShortcutBaseName(".gitignore").startsWith(".")).toBe(false);
  });

  it("supprime le point final", () => {
    expect(toShortcutBaseName("Nom.")).toBe("Nom");
  });

  it("tronque les noms trop longs sans laisser de point ni d'espace final", () => {
    const base = toShortcutBaseName("A".repeat(200));
    const baseAvecPoints = toShortcutBaseName(`${"Nom très long ".repeat(20)}.`);

    expect(base.length).toBeLessThanOrEqual(60);
    expect(baseAvecPoints.length).toBeLessThanOrEqual(60);
    [base, baseAvecPoints].forEach((valeur) => {
      expect(valeur.endsWith(".")).toBe(false);
      expect(valeur.endsWith(" ")).toBe(false);
    });
  });
});

describe("toShortcutFileName - extension par format", () => {
  it("applique l'extension correspondant au format", () => {
    expect(toShortcutFileName("ProjectCenter", "url")).toBe("ProjectCenter.url");
    expect(toShortcutFileName("ProjectCenter", "webloc")).toBe("ProjectCenter.webloc");
    expect(toShortcutFileName("ProjectCenter", "desktop")).toBe("ProjectCenter.desktop");
  });

  it("assainit le nom avant d'ajouter l'extension", () => {
    FORMATS.forEach((format) => {
      const fileName = toShortcutFileName('A/B:C*D?E"F<G>H|I\\J', format);
      const base = fileName.slice(0, fileName.lastIndexOf("."));

      expect(base).not.toMatch(CARACTERES_INTERDITS);
      expect(base).toBe(toShortcutBaseName('A/B:C*D?E"F<G>H|I\\J'));
    });
  });

  it("nomme raccourci un fichier issu d'un nom vide", () => {
    expect(toShortcutFileName("   ", "url")).toBe("raccourci.url");
  });
});

describe("shortcutFormatForOs - format téléchargeable par système", () => {
  it("associe chaque système de bureau à son format natif", () => {
    expect(shortcutFormatForOs("windows")).toBe("url");
    expect(shortcutFormatForOs("macos")).toBe("webloc");
    expect(shortcutFormatForOs("linux")).toBe("desktop");
  });

  it("ne propose aucun format pour les systèmes mobiles ou inconnus", () => {
    OS_SANS_FICHIER.forEach((os) => {
      expect(shortcutFormatForOs(os), `format inattendu pour ${os}`).toBeNull();
    });
  });
});

describe("resolveShortcutMode - mode d'ajout selon la plateforme", () => {
  it("propose le téléchargement de fichier sur les systèmes de bureau", () => {
    OS_BUREAU.forEach((os) => {
      expect(resolveShortcutMode(platform(os)), `mode inattendu pour ${os}`).toBe("file");
    });
  });

  it("propose des instructions sur les systèmes mobiles", () => {
    (["ios", "ipados", "android"] as PlatformOs[]).forEach((os) => {
      expect(resolveShortcutMode(platform(os)), `mode inattendu pour ${os}`).toBe("instructions");
    });
  });

  it("propose des instructions plutôt qu'une erreur sur un système inconnu", () => {
    expect(resolveShortcutMode(platform("unknown"))).toBe("instructions");
  });

  it("ne renvoie jamais autre chose que file ou instructions", () => {
    TOUS_LES_OS.forEach((os) => {
      expect(["file", "instructions"]).toContain(resolveShortcutMode(platform(os)));
    });
  });
});

describe("addToHomeInstructions - guidage d'ajout à l'écran d'accueil", () => {
  const texte = (info: PlatformInfo) => {
    const instructions = addToHomeInstructions(info);
    return [instructions.title, ...instructions.steps].join(" | ").toLowerCase();
  };

  it("guide Safari sur iPhone vers le menu Partager", () => {
    const contenu = texte(platform("ios", "safari"));

    expect(contenu).toMatch(/partager/);
    expect(contenu).toMatch(/écran d.accueil/);
  });

  it("renvoie vers Safari quand l'utilisateur est sur Chrome iOS", () => {
    const contenu = texte(platform("ios", "chrome"));

    expect(contenu).toMatch(/safari/);
    expect(contenu).toMatch(/écran d.accueil/);
  });

  it("renvoie vers Safari quand l'utilisateur est sur Firefox iOS", () => {
    expect(texte(platform("ios", "firefox"))).toMatch(/safari/);
  });

  it("guide Safari sur iPad vers l'écran d'accueil", () => {
    const contenu = texte(platform("ipados", "safari"));

    expect(contenu).toMatch(/partager/);
    expect(contenu).toMatch(/écran d.accueil/);
  });

  it("guide les navigateurs Android vers l'écran d'accueil", () => {
    (["chrome", "edge", "firefox", "samsung"] as const).forEach((browser) => {
      const info = platform("android", browser);
      const instructions = addToHomeInstructions(info);

      expect(instructions.steps.length, `aucune étape pour android/${browser}`).toBeGreaterThan(0);
      expect(texte(info), `guidage absent pour android/${browser}`).toMatch(/écran d.accueil/);
    });
  });

  it("fournit un guidage générique sur une plateforme inconnue", () => {
    const instructions = addToHomeInstructions(platform("unknown", "unknown"));

    expect(instructions.title.trim()).not.toBe("");
    expect(instructions.steps.length).toBeGreaterThan(0);
  });

  it("ne renvoie jamais d'étapes vides quelle que soit la combinaison", () => {
    const navigateurs = ["chrome", "safari", "firefox", "edge", "samsung", "unknown"] as const;

    TOUS_LES_OS.forEach((os) => {
      navigateurs.forEach((browser) => {
        const instructions = addToHomeInstructions(platform(os, browser));

        expect(instructions.steps.length, `aucune étape pour ${os}/${browser}`).toBeGreaterThan(0);
        instructions.steps.forEach((step) => {
          expect(step.trim(), `étape vide pour ${os}/${browser}`).not.toBe("");
        });
        expect(instructions.title.trim(), `titre vide pour ${os}/${browser}`).not.toBe("");
      });
    });
  });
});
