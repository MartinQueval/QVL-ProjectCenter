import { Suspense } from "react";
import { Toast } from "canopui";
import { AddToHomeSheet } from "./lazyAddToHomeSheet";
import { StoreIconAction } from "./StoreIconAction";
import { useDownloadShortcutButton } from "./useDownloadShortcutButton";

export interface DownloadShortcutButtonProps {
  name: string;
  url: string;
}

export function DownloadShortcutButton({ name, url }: DownloadShortcutButtonProps) {
  const {
    ariaLabel,
    hint,
    instructions,
    sheetMounted,
    sheetOpen,
    onActivate,
    onCloseSheet,
    onCopyLink,
    toast,
  } = useDownloadShortcutButton({ name, url });

  return (
    <>
      <StoreIconAction
        icon="download"
        ariaLabel={ariaLabel}
        hint={hint}
        accent
        onClick={onActivate}
      />

      {sheetMounted ? (
        <Suspense fallback={null}>
          <AddToHomeSheet
            open={sheetOpen}
            appName={name}
            url={url}
            instructions={instructions}
            onClose={onCloseSheet}
            onCopyLink={onCopyLink}
          />
        </Suspense>
      ) : null}

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        duration={toast.duration}
        onClose={toast.onClose}
      />
    </>
  );
}
