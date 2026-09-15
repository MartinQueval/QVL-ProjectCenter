import { Suspense, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { IconActionButton, Toast, motionDurationSeconds, motionEasing } from "canopui";
import { AddToHomeSheet } from "./lazyAddToHomeSheet";
import { useDownloadShortcutButton } from "./useDownloadShortcutButton";

export interface DownloadShortcutButtonProps {
  name: string;
  url: string;
}

const BUTTON_SIZE = "2.75rem";
const HOVER_LIFT = "-0.125rem";
const TAP_SCALE = 0.92;

const triggerStyle: CSSProperties = { display: "inline-flex" };

export function DownloadShortcutButton({ name, url }: DownloadShortcutButtonProps) {
  const {
    ariaLabel,
    hint,
    animated,
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
      <motion.span
        style={triggerStyle}
        title={hint}
        whileHover={animated ? { y: HOVER_LIFT } : undefined}
        whileTap={animated ? { scale: TAP_SCALE } : undefined}
        transition={{ duration: motionDurationSeconds.fast, ease: motionEasing.springSoft }}
      >
        <IconActionButton
          icon="download"
          variant="secondary"
          size={BUTTON_SIZE}
          iconSize="sm"
          ariaLabel={ariaLabel}
          onClick={onActivate}
        />
      </motion.span>

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
