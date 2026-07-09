import type { Project, Section } from "./types";

export const SECTIONS: Section[] = [
  { slug: "studio", label: "QVL-Studio", icon: "apps" },
  { slug: "hobbies", label: "QVL-Hobbies", icon: "image" },
  { slug: "toolbox", label: "QVL-ToolBox", icon: "settings" },
  { slug: "custhome", label: "QVL-CustHome", icon: "home" },
];

export const PROJECTS: Project[] = [
  {
    id: "canopui",
    section: "studio",
    name: "CanopUI",
    description: "Design system React de la flotte QVL, socle des portails.",
    logo: "projets/CanopUI/logo.png",
    url: "https://github.com/QVL-Studio/CanopUI",
    docPath: "projets/CanopUI/README.md",
  },
  {
    id: "traillog",
    section: "hobbies",
    name: "TrailLog",
    description: "Carnet de randonnées et de sorties outdoor.",
    logo: "projets/TrailLog/logo.png",
    url: "https://github.com/QVL-Hobbies/TrailLog",
    docPath: "projets/TrailLog/README.md",
  },
  {
    id: "pipeboard",
    section: "toolbox",
    name: "PipeBoard",
    description: "Tableau de bord des pipelines et de l'outillage interne.",
    logo: "projets/PipeBoard/logo.png",
    url: "https://github.com/QVL-ToolBox/PipeBoard",
    docPath: "projets/PipeBoard/README.md",
  },
  {
    id: "casaplan",
    section: "custhome",
    name: "CasaPlan",
    description: "Suivi des projets d'aménagement de la maison.",
    logo: "projets/CasaPlan/logo.png",
    url: "https://github.com/QVL-CustHome/CasaPlan",
    docPath: "projets/CasaPlan/README.md",
  },
];

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((section) => section.slug === slug);
}

export function getSectionProjects(slug: string): Project[] {
  return PROJECTS.filter((project) => project.section === slug);
}

export function getProject(slug: string, id: string): Project | undefined {
  return PROJECTS.find((project) => project.section === slug && project.id === id);
}
