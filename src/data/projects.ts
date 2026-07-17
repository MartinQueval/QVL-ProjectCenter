import type { Project, ProjectGroup, Section } from "./types";

export const SECTIONS: Section[] = [
  { slug: "studio", label: "QVL-Studio", icon: "apps" },
  { slug: "hobbies", label: "QVL-Hobbies", icon: "image" },
  { slug: "toolbox", label: "QVL-ToolBox", icon: "settings" },
  { slug: "custhome", label: "QVL-CustHome", icon: "home" },
];

export const PROJECTS: Project[] = [
  {
    id: "studio",
    section: "studio",
    name: "QVL-Studio",
    description: "Studio front de la flotte QVL : design system et portails.",
    docPath: "QVL-Studio/README.md",
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
    id: "toolbox",
    section: "toolbox",
    name: "QVL-ToolBox",
    description: "Boîte à outils et services internes de la flotte QVL.",
    docPath: "QVL-ToolBox/README.md",
  },
  {
    id: "canopui",
    section: "toolbox",
    parentId: "toolbox",
    name: "CanopUI",
    description: "Design system React de la flotte QVL, socle des portails.",
    logo: "projets/CanopUI/logo.png",
    url: "https://github.com/MartinQueval/QVL-CanopUI",
    docPath: "QVL-CanopUI/README.md",
  },
  {
    id: "aigate",
    section: "toolbox",
    parentId: "toolbox",
    name: "AIGate",
    description: "Passerelle unifiée vers les fournisseurs d'IA.",
    docPath: "QVL-ToolBox/AIGate/README.md",
  },
  {
    id: "healthserv",
    section: "toolbox",
    parentId: "toolbox",
    name: "HealthServ",
    description: "Supervision de la santé des services.",
    docPath: "QVL-ToolBox/HealthServ/README.md",
  },
  {
    id: "masterenv",
    section: "toolbox",
    parentId: "toolbox",
    name: "MasterEnv",
    description: "Registre centralisé des ports et variables d'environnement.",
    docPath: "QVL-ToolBox/MasterEnv/README.md",
  },
  {
    id: "missive",
    section: "toolbox",
    parentId: "toolbox",
    name: "Missive",
    description: "Service d'envoi et de suivi des notifications.",
    docPath: "QVL-ToolBox/Missive/README.md",
  },
  {
    id: "pipeboard",
    section: "toolbox",
    parentId: "toolbox",
    name: "PipeBoard",
    description: "Tableau de bord des pipelines et de l'outillage interne.",
    logo: "projets/PipeBoard/logo.png",
    url: "https://github.com/QVL-ToolBox/PipeBoard",
    docPath: "QVL-ToolBox/PipeBoard/README.md",
  },
  {
    id: "prviewer",
    section: "toolbox",
    parentId: "toolbox",
    name: "PrViewer",
    description: "Revue et visualisation des pull requests.",
    docPath: "QVL-ToolBox/PrViewer/README.md",
  },
  {
    id: "relay",
    section: "toolbox",
    parentId: "toolbox",
    name: "Relay",
    description: "Relais de messages entre services de la flotte.",
    docPath: "QVL-ToolBox/Relay/README.md",
  },
  {
    id: "switch",
    section: "toolbox",
    parentId: "toolbox",
    name: "Switch",
    description: "Aiguillage et bascule de trafic entre environnements.",
    docPath: "QVL-ToolBox/Switch/README.md",
  },

  {
    id: "custhome",
    section: "custhome",
    name: "QVL-CustHome",
    description: "Suite applicative CustHome : SSO, Drive, Budgy et services associés.",
    docPath: "QVL-CustHome/README.md",
  },
  {
    id: "ch-api-authenticator",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Authenticator",
    description: "API d'authentification et de gestion des sessions.",
    docPath: "QVL-CustHome/CH-Api-Authenticator/README.md",
  },
  {
    id: "ch-api-budgy",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Budgy",
    description: "API de suivi de budget et de dépenses.",
    docPath: "QVL-CustHome/CH-Api-Budgy/README.md",
  },
  {
    id: "ch-api-drive",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Drive",
    description: "API de stockage et de partage de fichiers.",
    docPath: "QVL-CustHome/CH-Api-Drive/README.md",
  },
  {
    id: "ch-api-gateway",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-GateWay",
    description: "Passerelle d'API et routage des services CustHome.",
    docPath: "QVL-CustHome/CH-Api-GateWay/README.md",
  },
  {
    id: "ch-portail-admin",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portail-Admin",
    description: "Portail d'administration des utilisateurs, rôles et accès.",
    url: "https://ch-admin.qvl-project.com",
    docPath: "QVL-CustHome/CH-Portail-Admin/README.md",
  },
  {
    id: "ch-portal-authenticator",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Authenticator",
    description: "Portail de connexion et de gestion du compte (SSO).",
    url: "https://ch-auth.qvl-project.com",
    docPath: "QVL-CustHome/CH-Portal-Authenticator/README.md",
  },
  {
    id: "ch-portal-budgy",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Budgy",
    description: "Portail de suivi de budget et de dépenses.",
    url: "https://ch-budgy.qvl-project.com",
    docPath: "QVL-CustHome/CH-Portal-Budgy/README.md",
  },
  {
    id: "ch-portal-drive",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Drive",
    description: "Portail de stockage et de partage de fichiers.",
    url: "https://ch-drive.qvl-project.com",
    docPath: "QVL-CustHome/CH-Portal-Drive/README.md",
  },
  {
    id: "ch-relay",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Relay",
    description: "Relais de communication entre les services CustHome.",
    docPath: "QVL-CustHome/CH-Relay/README.md",
  },
  {
    id: "ch-tools",
    section: "custhome",
    parentId: "custhome",
    name: "Tools",
    description: "Outillage transverse de la suite CustHome.",
    docPath: "QVL-CustHome/Tools/README.md",
  },
];

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((section) => section.slug === slug);
}

export function getSectionProjects(slug: string): Project[] {
  return PROJECTS.filter((project) => project.section === slug);
}

export function getSectionTopLevelProjects(slug: string): Project[] {
  return PROJECTS.filter((project) => project.section === slug && project.parentId === undefined);
}

export function getSectionTree(slug: string): ProjectGroup[] {
  return getSectionTopLevelProjects(slug).map((project) => ({
    project,
    children: PROJECTS.filter((candidate) => candidate.parentId === project.id),
  }));
}

export function getProject(slug: string, id: string): Project | undefined {
  return PROJECTS.find((project) => project.section === slug && project.id === id);
}
