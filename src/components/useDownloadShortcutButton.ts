import { useCallback, useEffect, useMemo, useState } from "react";
import { useCopyToClipboard, useTranslation, type CanopToastSeverity } from "canopui";
import { detectPlatform, type PlatformInfo, type PlatformOs } from "../lib/platform";
import {
  addToHomeInstructions,
  buildShortcut,
  resolveShortcutMode,
  shortcutFormatForOs,
  type AddToHomeInstructions,
  type Shortcut,
} from "../lib/desktopShortcut";
import { preloadAddToHomeSheet } from "./lazyAddToHomeSheet";

export interface DownloadShortcutToast {
  open: boolean;
  message: string;
  severity: CanopToastSeverity;
  duration: number;
  onClose: () => void;
}

export interface UseDownloadShortcutButtonParams {
  name: string;
  url: string;
}

export interface UseDownloadShortcutButtonResult {
  ariaLabel: string;
  hint: string;
  instructions: AddToHomeInstructions;
  sheetMounted: boolean;
  sheetOpen: boolean;
  onActivate: () => void;
  onCloseSheet: () => void;
  onCopyLink: () => void;
  toast: DownloadShortcutToast;
}

interface ShortcutToastState {
  messageKey: string;
  fileName?: string;
  severity: CanopToastSeverity;
  duration: number;
}

type SheetState = "idle" | "open" | "closed";

const OBJECT_URL_RELEASE_DELAY = 1000;
const IDLE_TOAST_DURATION = 4000;

const COPY_SUCCESS_TOAST: ShortcutToastState = {
  messageKey: "shortcut.toast.copied",
  severity: "success",
  duration: 4000,
};

const COPY_FAILURE_TOAST: ShortcutToastState = {
  messageKey: "shortcut.toast.copyFailed",
  severity: "error",
  duration: 8000,
};

function linuxExecutableToast(fileName: string): ShortcutToastState {
  return {
    messageKey: "shortcut.toast.linuxExecutable",
    fileName,
    severity: "info",
    duration: 12000,
  };
}

function currentPlatform(): PlatformInfo {
  return detectPlatform(navigator.userAgent, navigator.maxTouchPoints);
}

function shortcutFor(name: string, url: string, os: PlatformOs): Shortcut | null {
  const format = shortcutFormatForOs(os);
  if (format === null) {
    return null;
  }
  try {
    return buildShortcut(name, url, format);
  } catch {
    return null;
  }
}

function saveShortcut(shortcut: Shortcut): void {
  const blob = new Blob([shortcut.content], { type: shortcut.mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = shortcut.fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_RELEASE_DELAY);
}

export function useDownloadShortcutButton({
  name,
  url,
}: UseDownloadShortcutButtonParams): UseDownloadShortcutButtonResult {
  const { t } = useTranslation();
  const platform = useMemo(currentPlatform, []);
  const mode = useMemo(() => resolveShortcutMode(platform), [platform]);
  const instructions = useMemo(() => addToHomeInstructions(platform), [platform]);
  const [sheetState, setSheetState] = useState<SheetState>("idle");
  const [toastState, setToastState] = useState<ShortcutToastState | null>(null);
  const { copied, failed, copy } = useCopyToClipboard(url);

  useEffect(() => {
    if (copied) {
      setToastState(COPY_SUCCESS_TOAST);
      return;
    }
    if (failed) {
      setToastState(COPY_FAILURE_TOAST);
    }
  }, [copied, failed]);

  const openSheet = useCallback(async () => {
    await preloadAddToHomeSheet();
    setSheetState("open");
  }, []);

  const onActivate = useCallback(() => {
    const shortcut = mode === "file" ? shortcutFor(name, url, platform.os) : null;
    if (shortcut === null) {
      void openSheet();
      return;
    }
    saveShortcut(shortcut);
    if (platform.os === "linux") {
      setToastState(linuxExecutableToast(shortcut.fileName));
    }
  }, [mode, name, url, platform.os, openSheet]);

  const onCloseSheet = useCallback(() => setSheetState("closed"), []);
  const onCopyLink = useCallback(() => copy(), [copy]);
  const onCloseToast = useCallback(() => setToastState(null), []);

  const toastMessage = toastState
    ? t(toastState.messageKey, { fileName: toastState.fileName ?? "" })
    : "";

  const toast = useMemo<DownloadShortcutToast>(
    () => ({
      open: toastState !== null,
      message: toastMessage,
      severity: toastState?.severity ?? "info",
      duration: toastState?.duration ?? IDLE_TOAST_DURATION,
      onClose: onCloseToast,
    }),
    [toastState, toastMessage, onCloseToast],
  );

  return {
    ariaLabel:
      mode === "file"
        ? t("shortcut.download.label", { name })
        : t("shortcut.addToHome.label", { name }),
    hint: mode === "file" ? t("shortcut.download.hint") : t("shortcut.addToHome.hint"),
    instructions,
    sheetMounted: sheetState !== "idle",
    sheetOpen: sheetState === "open",
    onActivate,
    onCloseSheet,
    onCopyLink,
    toast,
  };
}
