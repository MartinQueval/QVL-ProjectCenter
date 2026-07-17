import type { ChIconName } from "canopui";

export type SectionSlug = "studio" | "hobbies" | "toolbox" | "custhome";

export interface Section {
  slug: SectionSlug;
  label: string;
  icon?: ChIconName;
}

export interface Project {
  id: string;
  section: SectionSlug;
  name: string;
  description: string;
  docPath: string;
  logo?: string;
  url?: string;
  parentId?: string;
}

export interface ProjectGroup {
  project: Project;
  children: Project[];
}
