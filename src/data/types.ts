import type { CanopIconName } from "canopui";

export type SectionSlug = "hobbies" | "custhome" | "toolbox";

export type ProjectStatus = "live" | "beta" | "interne";

export interface Section {
  slug: SectionSlug;
  label: string;
  order: number;
  icon?: CanopIconName;
  featured?: boolean;
  tagline?: string;
}

export interface Project {
  id: string;
  section: SectionSlug;
  name: string;
  description: string;
  docPath: string;
  iconSrc?: string;
  url?: string;
  parentId?: string;
  store?: boolean;
  tagline?: string;
  order?: number;
  status?: ProjectStatus;
}
