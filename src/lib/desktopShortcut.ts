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
  title: string;
  steps: readonly string[];
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

const GENERIC_INSTRUCTIONS: AddToHomeInstructions = {
  title: "Depuis votre navigateur",
  steps: [
    "Ouvrez le lien ci-dessous.",
    "Ouvrez le menu de votre navigateur.",
    "Choisissez « Ajouter à l'écran d'accueil », ou ajoutez la page à vos favoris.",
  ],
};

const IOS_SAFARI_INSTRUCTIONS: AddToHomeInstructions = {
  title: "Sur Safari",
  steps: [
    "Ouvrez le lien ci-dessous dans Safari.",
    "Touchez le bouton Partager, dans la barre du bas.",
    "Faites défiler la liste, puis choisissez « Sur l'écran d'accueil ».",
    "Confirmez avec « Ajouter ».",
  ],
};

const IOS_OTHER_BROWSER_INSTRUCTIONS: AddToHomeInstructions = {
  title: "Ouvrez d'abord Safari",
  steps: [
    "Sur iPhone et iPad, seul Safari sait ajouter un raccourci à l'écran d'accueil.",
    "Copiez le lien ci-dessous, puis collez-le dans Safari.",
    "Touchez le bouton Partager, puis « Sur l'écran d'accueil ».",
  ],
};

const ANDROID_CHROME_INSTRUCTIONS: AddToHomeInstructions = {
  title: "Sur Chrome",
  steps: [
    "Ouvrez le lien ci-dessous dans Chrome.",
    "Touchez le menu ⋮, en haut à droite.",
    "Choisissez « Ajouter à l'écran d'accueil ».",
    "Confirmez avec « Ajouter ».",
  ],
};

const ANDROID_FIREFOX_INSTRUCTIONS: AddToHomeInstructions = {
  title: "Sur Firefox",
  steps: [
    "Ouvrez le lien ci-dessous dans Firefox.",
    "Touchez le menu ⋮, en bas à droite.",
    "Choisissez « Ajouter à l'écran d'accueil ».",
  ],
};

const ANDROID_SAMSUNG_INSTRUCTIONS: AddToHomeInstructions = {
  title: "Sur Samsung Internet",
  steps: [
    "Ouvrez le lien ci-dessous dans Samsung Internet.",
    "Touchez le menu ☰, en bas à droite.",
    "Choisissez « Ajouter la page à », puis « Écran d'accueil ».",
  ],
};

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
