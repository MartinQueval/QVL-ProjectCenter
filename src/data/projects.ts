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
    url: "https://github.com/MartinQueval/QVL-CanopUI",
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
    id: "ch-auth",
    section: "custhome",
    name: "Authentification",
    description: "Connexion et gestion du compte CustHome (SSO).",
    logo: "",
    url: "https://ch-auth.qvl-project.com",
    docPath: "projets/CustHome/Authenticator/README.md",
  },
  {
    id: "ch-admin",
    section: "custhome",
    name: "Administration",
    description: "Gestion des utilisateurs, des rôles et des accès.",
    logo: "",
    url: "https://ch-admin.qvl-project.com",
    docPath: "projets/CustHome/Admin/README.md",
  },
  {
    id: "ch-drive",
    section: "custhome",
    name: "Drive",
    description: "Stockage et partage de fichiers.",
    logo: "",
    url: "https://ch-drive.qvl-project.com",
    docPath: "projets/CustHome/Drive/README.md",
  },
  {
    id: "ch-budgy",
    section: "custhome",
    name: "Budgy",
    description: "Suivi de budget et de dépenses.",
    logo: "",
    url: "https://ch-budgy.qvl-project.com",
    docPath: "projets/CustHome/Budgy/README.md",
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
