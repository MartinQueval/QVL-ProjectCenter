import { describe, expect, it } from "vitest";
import { detectPlatform } from "./platform";

const UA = {
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  windowsEdge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.91",
  macosSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  macosLike: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  linuxFirefox: "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  iphoneChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1",
  iphoneFirefox:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/121.0 Mobile/15E148 Safari/605.1.15",
  ipadLegacy:
    "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/605.1",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  androidSamsung:
    "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36",
  androidFirefox: "Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0",
  androidEdge:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 EdgA/120.0.2210.126",
};

describe("detectPlatform - systèmes de bureau", () => {
  it("reconnaît Windows avec Chrome", () => {
    const platform = detectPlatform(UA.windowsChrome);

    expect(platform.os).toBe("windows");
    expect(platform.browser).toBe("chrome");
    expect(platform.isMobile).toBe(false);
  });

  it("reconnaît macOS avec Safari", () => {
    const platform = detectPlatform(UA.macosSafari);

    expect(platform.os).toBe("macos");
    expect(platform.browser).toBe("safari");
    expect(platform.isMobile).toBe(false);
  });

  it("reconnaît Linux avec Firefox", () => {
    const platform = detectPlatform(UA.linuxFirefox);

    expect(platform.os).toBe("linux");
    expect(platform.browser).toBe("firefox");
    expect(platform.isMobile).toBe(false);
  });
});

describe("detectPlatform - pièges iOS et iPadOS", () => {
  it("classe un iPhone en ios malgré le like Mac OS X de son user agent", () => {
    expect(detectPlatform(UA.iphoneSafari).os).toBe("ios");
    expect(detectPlatform(UA.iphoneSafari).os).not.toBe("macos");
  });

  it("classe un iPad moderne en ipados grâce aux points tactiles", () => {
    const platform = detectPlatform(UA.macosLike, 5);

    expect(platform.os).toBe("ipados");
    expect(platform.isMobile).toBe(true);
  });

  it("garde un vrai Mac en macos avec le même user agent sans point tactile", () => {
    const platform = detectPlatform(UA.macosLike, 0);

    expect(platform.os).toBe("macos");
    expect(platform.isMobile).toBe(false);
  });

  it("reconnaît un iPad ancien annoncé explicitement dans le user agent", () => {
    const platform = detectPlatform(UA.ipadLegacy);

    expect(platform.os).toBe("ipados");
    expect(platform.isMobile).toBe(true);
  });
});

describe("detectPlatform - Android face à Linux", () => {
  it("classe Android en android et non en linux", () => {
    const platform = detectPlatform(UA.androidChrome);

    expect(platform.os).toBe("android");
    expect(platform.os).not.toBe("linux");
    expect(platform.isMobile).toBe(true);
  });
});

describe("detectPlatform - navigateurs dérivés de Chrome", () => {
  it("reconnaît Edge malgré le marqueur Chrome", () => {
    expect(detectPlatform(UA.windowsEdge).browser).toBe("edge");
  });

  it("reconnaît Samsung Internet malgré le marqueur Chrome", () => {
    expect(detectPlatform(UA.androidSamsung).browser).toBe("samsung");
  });

  it("reconnaît Chrome sur iOS via CriOS", () => {
    const platform = detectPlatform(UA.iphoneChrome);

    expect(platform.browser).toBe("chrome");
    expect(platform.os).toBe("ios");
  });

  it("reconnaît Firefox sur iOS via FxiOS", () => {
    const platform = detectPlatform(UA.iphoneFirefox);

    expect(platform.browser).toBe("firefox");
    expect(platform.os).toBe("ios");
  });
});

describe("detectPlatform - entrées dégradées", () => {
  it("renvoie unknown pour une chaîne vide", () => {
    const platform = detectPlatform("");

    expect(platform.os).toBe("unknown");
    expect(platform.browser).toBe("unknown");
    expect(platform.isMobile).toBe(false);
  });

  it("renvoie unknown pour un user agent non identifiable", () => {
    const platform = detectPlatform("curl/8.4.0");

    expect(platform.os).toBe("unknown");
    expect(platform.browser).toBe("unknown");
  });

  it("ne classe pas un user agent vide en mobile même avec des points tactiles", () => {
    expect(detectPlatform("", 5).isMobile).toBe(false);
  });
});

describe("detectPlatform - isMobile réservé aux plateformes mobiles", () => {
  const cas = [
    { userAgent: UA.windowsChrome, touchPoints: 0, attendu: false },
    { userAgent: UA.macosSafari, touchPoints: 0, attendu: false },
    { userAgent: UA.linuxFirefox, touchPoints: 0, attendu: false },
    { userAgent: UA.iphoneSafari, touchPoints: 5, attendu: true },
    { userAgent: UA.macosLike, touchPoints: 5, attendu: true },
    { userAgent: UA.ipadLegacy, touchPoints: 5, attendu: true },
    { userAgent: UA.androidChrome, touchPoints: 5, attendu: true },
    { userAgent: UA.androidFirefox, touchPoints: 5, attendu: true },
    { userAgent: UA.androidEdge, touchPoints: 5, attendu: true },
    { userAgent: "curl/8.4.0", touchPoints: 0, attendu: false },
  ];

  it("n'est vrai que pour ios, ipados et android", () => {
    cas.forEach(({ userAgent, touchPoints, attendu }) => {
      const platform = detectPlatform(userAgent, touchPoints);

      expect(platform.isMobile, `isMobile inattendu pour ${platform.os}`).toBe(attendu);
      expect(platform.isMobile).toBe(
        platform.os === "ios" || platform.os === "ipados" || platform.os === "android",
      );
    });
  });

  it("ne rend pas un poste de bureau mobile à cause d'un écran tactile", () => {
    expect(detectPlatform(UA.windowsChrome, 10).isMobile).toBe(false);
  });
});
