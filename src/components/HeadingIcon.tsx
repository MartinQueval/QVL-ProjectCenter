import Box from "@mui/material/Box";
import {
  Icon,
  type CanopHeadingSize,
  type CanopIconColor,
  type CanopIconName,
  type CanopIconVariant,
  type CanopResponsiveHeadingSize,
} from "canopui";
import { headingIconSx } from "./headingIconSx";

export interface HeadingIconProps {
  name: CanopIconName;
  size: CanopHeadingSize | CanopResponsiveHeadingSize;
  color?: CanopIconColor;
  variant?: CanopIconVariant;
}

export function HeadingIcon({ name, size, color, variant }: HeadingIconProps) {
  return (
    <Box sx={headingIconSx(size)}>
      <Icon name={name} color={color} variant={variant} />
    </Box>
  );
}
