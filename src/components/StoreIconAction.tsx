import type { CSSProperties } from "react";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import {
  IconActionButton,
  motionDurationSeconds,
  motionEasing,
  type CanopIconName,
} from "canopui";
import { useStoreIconAction } from "./useStoreIconAction";

export interface StoreIconActionProps {
  icon: CanopIconName;
  ariaLabel: string;
  hint: string;
  accent?: boolean;
  onClick: () => void;
}

const BUTTON_SIZE = "2.75rem";
const HOVER_LIFT = "-0.125rem";
const TAP_SCALE = 0.92;

const triggerStyle: CSSProperties = { display: "inline-flex" };

export function StoreIconAction({
  icon,
  ariaLabel,
  hint,
  accent = false,
  onClick,
}: StoreIconActionProps) {
  const { animated, wrapperSx } = useStoreIconAction(accent);

  return (
    <Box sx={wrapperSx}>
      <motion.span
        style={triggerStyle}
        title={hint}
        whileHover={animated ? { y: HOVER_LIFT } : undefined}
        whileTap={animated ? { scale: TAP_SCALE } : undefined}
        transition={{ duration: motionDurationSeconds.fast, ease: motionEasing.springSoft }}
      >
        <IconActionButton
          icon={icon}
          variant="secondary"
          size={BUTTON_SIZE}
          iconSize="sm"
          ariaLabel={ariaLabel}
          onClick={onClick}
        />
      </motion.span>
    </Box>
  );
}
