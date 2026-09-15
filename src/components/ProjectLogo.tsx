import type { CSSProperties } from "react";
import { tokens } from "canopui";
import { useProjectLogo } from "./useProjectLogo";

export type ProjectLogoSize = "md" | "lg";

export interface ProjectLogoProps {
  id: string;
  name: string;
  iconSrc?: string;
  size?: ProjectLogoSize;
}

interface LogoScale {
  frame: string;
  icon: string;
  monogram: string;
}

interface LogoStyles {
  frame: CSSProperties;
  iconFrame: CSSProperties;
  icon: CSSProperties;
  monogram: CSSProperties;
}

const SCALES: Record<ProjectLogoSize, LogoScale> = {
  md: { frame: "3rem", icon: "2rem", monogram: tokens.typography.fontSize.lg },
  lg: { frame: "4.5rem", icon: "3rem", monogram: tokens.typography.fontSize.xxl },
};

function buildStyles({ frame, icon, monogram }: LogoScale): LogoStyles {
  const frameStyle: CSSProperties = {
    width: frame,
    height: frame,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "var(--canop-radius-sm)",
  };

  return {
    frame: frameStyle,
    iconFrame: { ...frameStyle, backgroundColor: "var(--canop-palette-secondary-light)" },
    icon: { display: "block", width: icon, height: icon, objectFit: "contain" },
    monogram: {
      fontFamily: tokens.typography.fontFamilyHeading,
      fontSize: monogram,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.none,
    },
  };
}

const STYLES: Record<ProjectLogoSize, LogoStyles> = {
  md: buildStyles(SCALES.md),
  lg: buildStyles(SCALES.lg),
};

export function ProjectLogo({ id, name, iconSrc, size = "md" }: ProjectLogoProps) {
  const { showIcon, iconUrl, monogram, tone, onIconError } = useProjectLogo({ id, name, iconSrc });
  const styles = STYLES[size];

  if (showIcon && iconUrl) {
    return (
      <span style={styles.iconFrame}>
        <img src={iconUrl} alt="" onError={onIconError} style={styles.icon} />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ ...styles.frame, backgroundColor: tone.background, color: tone.color }}
    >
      <span style={styles.monogram}>{monogram}</span>
    </span>
  );
}
