export type PlatformOs = "windows" | "macos" | "linux" | "ios" | "ipados" | "android" | "unknown";

export type PlatformBrowser = "chrome" | "safari" | "firefox" | "edge" | "samsung" | "unknown";

export interface PlatformInfo {
  os: PlatformOs;
  browser: PlatformBrowser;
  isMobile: boolean;
}

const MOBILE_OPERATING_SYSTEMS: readonly PlatformOs[] = ["ios", "ipados", "android"];

const IPAD_MINIMUM_TOUCH_POINTS = 2;

function detectBrowser(userAgent: string): PlatformBrowser {
  if (/Edg(?:e|A|iOS)?\//.test(userAgent)) {
    return "edge";
  }
  if (/SamsungBrowser\//.test(userAgent)) {
    return "samsung";
  }
  if (/(?:Firefox|FxiOS)\//.test(userAgent)) {
    return "firefox";
  }
  if (/(?:Chrome|Chromium|CriOS)\//.test(userAgent)) {
    return "chrome";
  }
  if (/Safari\//.test(userAgent)) {
    return "safari";
  }
  return "unknown";
}

function detectOs(userAgent: string, maxTouchPoints: number): PlatformOs {
  if (/Android/.test(userAgent)) {
    return "android";
  }
  if (/iPhone|iPod/.test(userAgent)) {
    return "ios";
  }
  if (/iPad/.test(userAgent)) {
    return "ipados";
  }
  if (/Macintosh|Mac OS X/.test(userAgent)) {
    return maxTouchPoints >= IPAD_MINIMUM_TOUCH_POINTS ? "ipados" : "macos";
  }
  if (/Windows|Win32|Win64/.test(userAgent)) {
    return "windows";
  }
  if (/Linux|X11|CrOS/.test(userAgent)) {
    return "linux";
  }
  return "unknown";
}

export function detectPlatform(userAgent: string, maxTouchPoints = 0): PlatformInfo {
  const os = detectOs(userAgent, maxTouchPoints);
  return { os, browser: detectBrowser(userAgent), isMobile: MOBILE_OPERATING_SYSTEMS.includes(os) };
}
