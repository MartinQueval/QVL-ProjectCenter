import type { PlatformBrowser, PlatformInfo, PlatformOs } from "./platform";

export type ShortcutFormat = "url" | "webloc" | "desktop";

export interface Shortcut {
  fileName: string;
  mimeType: string;
  content: string;
}

export type DownloadShortcutMode = "file" | "instructions" | "pwa";

export type ResolvedShortcutMode = Exclude<DownloadShortcutMode, "pwa">;

export interface AddToHomeInstructions {
  titleKey: string;
  stepKeys: readonly string[];
}

const FORBIDDEN_FILE_NAME_CHARACTERS = /[\\/:*?"<>|]|\p{Cc}/gu;
const EDGE_TRIMMED_CHARACTERS = /^[.\s]+|[.\s]+$/g;
const CONSECUTIVE_WHITESPACE = /\s+/g;
const FILE_NAME_MAX_LENGTH = 60;
const FALLBACK_FILE_NAME = "raccourci";

const CRLF = "\r\n";
const LF = "\n";

const SHORTCUT_EXTENSIONS: Record<ShortcutFormat, string> = {
  url: "url",
  webloc: "webloc",
  desktop: "desktop",
};

const SHORTCUT_MIME_TYPES: Record<ShortcutFormat, string> = {
  url: "application/internet-shortcut",
  webloc: "application/octet-stream",
  desktop: "application/x-desktop",
};

const SHORTCUT_FORMATS_BY_OS: Partial<Record<PlatformOs, ShortcutFormat>> = {
  windows: "url",
  macos: "webloc",
  linux: "desktop",
};

export function toShortcutBaseName(name: string): string {
  const sanitized = name
    .replace(FORBIDDEN_FILE_NAME_CHARACTERS, " ")
    .replace(CONSECUTIVE_WHITESPACE, " ")
    .trim()
    .slice(0, FILE_NAME_MAX_LENGTH)
    .replace(EDGE_TRIMMED_CHARACTERS, "");
  return sanitized.length > 0 ? sanitized : FALLBACK_FILE_NAME;
}

export function toShortcutFileName(name: string, format: ShortcutFormat): string {
  return `${toShortcutBaseName(name)}.${SHORTCUT_EXTENSIONS[format]}`;
}

function toHttpsUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Raccourci impossible : « ${url} » n'est pas une URL absolue.`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`Raccourci impossible : « ${url} » n'est pas une URL https.`);
  }
  return parsed;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function windowsInternetShortcut(href: string): string {
  return ["[InternetShortcut]", `URL=${href}`, ""].join(CRLF);
}

function macosWebloc(href: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0">',
    "<dict>",
    "\t<key>URL</key>",
    `\t<string>${escapeXml(href)}</string>`,
    "</dict>",
    "</plist>",
    "",
  ].join(LF);
}

function linuxDesktopEntry(href: string, label: string): string {
  return [
    "[Desktop Entry]",
    "Type=Link",
    `Name=${label}`,
    `URL=${href}`,
    "Icon=text-html",
    "",
  ].join(LF);
}

const SHORTCUT_CONTENT_BUILDERS: Record<ShortcutFormat, (href: string, label: string) => string> = {
  url: (href) => windowsInternetShortcut(href),
  webloc: (href) => macosWebloc(href),
  desktop: (href, label) => linuxDesktopEntry(href, label),
};

export function buildShortcut(name: string, url: string, format: ShortcutFormat): Shortcut {
  const { href } = toHttpsUrl(url);
  return {
    fileName: toShortcutFileName(name, format),
    mimeType: SHORTCUT_MIME_TYPES[format],
    content: SHORTCUT_CONTENT_BUILDERS[format](href, toShortcutBaseName(name)),
  };
}

export function shortcutFormatForOs(os: PlatformOs): ShortcutFormat | null {
  return SHORTCUT_FORMATS_BY_OS[os] ?? null;
}

export function resolveShortcutMode(platform: PlatformInfo): ResolvedShortcutMode {
  if (platform.isMobile) {
    return "instructions";
  }
  return shortcutFormatForOs(platform.os) === null ? "instructions" : "file";
}

function instructionsFor(group: string, stepCount: number): AddToHomeInstructions {
  return {
    titleKey: `shortcut.steps.${group}.title`,
    stepKeys: Array.from(
      { length: stepCount },
      (_, index) => `shortcut.steps.${group}.${index + 1}`,
    ),
  };
}

const GENERIC_INSTRUCTIONS = instructionsFor("generic", 3);
const IOS_SAFARI_INSTRUCTIONS = instructionsFor("iosSafari", 4);
const IOS_OTHER_BROWSER_INSTRUCTIONS = instructionsFor("iosOther", 3);
const ANDROID_CHROME_INSTRUCTIONS = instructionsFor("androidChrome", 4);
const ANDROID_FIREFOX_INSTRUCTIONS = instructionsFor("androidFirefox", 3);
const ANDROID_SAMSUNG_INSTRUCTIONS = instructionsFor("androidSamsung", 3);

const ANDROID_INSTRUCTIONS_BY_BROWSER: Partial<Record<PlatformBrowser, AddToHomeInstructions>> = {
  chrome: ANDROID_CHROME_INSTRUCTIONS,
  edge: ANDROID_CHROME_INSTRUCTIONS,
  firefox: ANDROID_FIREFOX_INSTRUCTIONS,
  samsung: ANDROID_SAMSUNG_INSTRUCTIONS,
};

export function addToHomeInstructions({ os, browser }: PlatformInfo): AddToHomeInstructions {
  if (os === "ios" || os === "ipados") {
    return browser === "safari" ? IOS_SAFARI_INSTRUCTIONS : IOS_OTHER_BROWSER_INSTRUCTIONS;
  }
  if (os === "android") {
    return ANDROID_INSTRUCTIONS_BY_BROWSER[browser] ?? GENERIC_INSTRUCTIONS;
  }
  return GENERIC_INSTRUCTIONS;
}
