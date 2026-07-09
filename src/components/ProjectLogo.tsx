import type { CSSProperties } from "react";
import { tokens } from "canopui";
import { useProjectLogo } from "./useProjectLogo";

export interface ProjectLogoProps {
  name: string;
  logo: string;
}

const containerStyle: CSSProperties = {
  width: "3.5rem",
  height: "3.5rem",
  flexShrink: 0,
  borderRadius: tokens.radius.md,
  backgroundColor: "var(--ch-palette-secondary-light)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

const initialsStyle: CSSProperties = {
  color: "var(--ch-palette-primary-main)",
  fontWeight: tokens.typography.fontWeight.bold,
  fontSize: tokens.typography.fontSize.lg,
  lineHeight: tokens.typography.lineHeight.tight,
};

export function ProjectLogo({ name, logo }: ProjectLogoProps) {
  const { showFallback, initials, onImageError } = useProjectLogo(name, logo);

  return (
    <span style={containerStyle}>
      {showFallback ? (
        <span style={initialsStyle}>{initials}</span>
      ) : (
        <img src={logo} alt={`Logo ${name}`} onError={onImageError} style={imageStyle} />
      )}
    </span>
  );
}
