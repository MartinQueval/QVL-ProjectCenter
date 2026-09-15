import departementalIcon from "../assets/apps/departemental.svg";
import statbarIcon from "../assets/apps/statbar.svg";
import type { Project, Section, SectionSlug } from "./types";

export const SECTIONS: Section[] = [
  { slug: "hobbies", label: "QVL-Hobbies", order: 1, icon: "image", featured: true },
  { slug: "custhome", label: "QVL-CustHome", order: 2, icon: "user" },
  { slug: "toolbox", label: "QVL-ToolBox", order: 3, icon: "settings" },
];

export const PROJECTS: Project[] = [
  {
    id: "hobbies",
    section: "hobbies",
    name: "QVL-Hobbies",
    docPath: "QVL-Hobbies/README.md",
    order: 0,
  },
  {
    id: "hb-front-statbar",
    section: "hobbies",
    parentId: "hobbies",
    name: "StatBar",
    docPath: "QVL-Hobbies/HB-Front-StatBar/README.md",
    iconSrc: statbarIcon,
    url: "https://statbar.qvl-project.com",
    store: true,
    status: "live",
    order: 1,
  },
  {
    id: "hb-front-fonddeshaker",
    section: "hobbies",
    parentId: "hobbies",
    name: "FondDeShaker",
    docPath: "QVL-Hobbies/HB-Front-FondDeShaker/README.md",
    url: "https://fonddeshaker.qvl-project.com",
    store: true,
    status: "live",
    order: 2,
  },
  {
    id: "hb-front-departemental",
    section: "hobbies",
    parentId: "hobbies",
    name: "DéparteMental",
    docPath: "QVL-Hobbies/HB-Front-DeparteMental/README.md",
    iconSrc: departementalIcon,
    url: "https://departemental.qvl-project.com",
    store: true,
    status: "live",
    order: 3,
  },
  {
    id: "hb-api-cocktail",
    section: "hobbies",
    parentId: "hobbies",
    name: "HB-Api-Cocktail",
    docPath: "QVL-Hobbies/HB-Api-Cocktail/README.md",
    url: "https://api-cocktail.qvl-project.com",
    status: "live",
    order: 4,
  },
  {
    id: "hb-api-statbar",
    section: "hobbies",
    parentId: "hobbies",
    name: "HB-Api-StatBar",
    docPath: "QVL-Hobbies/HB-Api-StatBar/README.md",
    status: "interne",
    order: 5,
  },

  {
    id: "custhome",
    section: "custhome",
    name: "QVL-CustHome",
    docPath: "QVL-CustHome/README.md",
    order: 0,
  },
  {
    id: "ch-portal-authenticator",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Authenticator",
    docPath: "QVL-CustHome/CH-Portal-Authenticator/README.md",
    url: "https://ch-auth.qvl-project.com",
    store: false,
    status: "live",
    order: 1,
  },
  {
    id: "ch-portail-admin",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portail-Admin",
    docPath: "QVL-CustHome/CH-Portail-Admin/README.md",
    url: "https://ch-admin.qvl-project.com",
    store: true,
    status: "live",
    order: 2,
  },
  {
    id: "ch-portal-drive",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Drive",
    docPath: "QVL-CustHome/CH-Portal-Drive/README.md",
    url: "https://ch-drive.qvl-project.com",
    store: true,
    status: "live",
    order: 3,
  },
  {
    id: "ch-portal-budgy",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Budgy",
    docPath: "QVL-CustHome/CH-Portal-Budgy/README.md",
    url: "https://ch-budgy.qvl-project.com",
    store: true,
    status: "live",
    order: 4,
  },
  {
    id: "ch-api-authenticator",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Authenticator",
    docPath: "QVL-CustHome/CH-Api-Authenticator/README.md",
    order: 10,
  },
  {
    id: "ch-api-budgy",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Budgy",
    docPath: "QVL-CustHome/CH-Api-Budgy/README.md",
    order: 11,
  },
  {
    id: "ch-api-drive",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Drive",
    docPath: "QVL-CustHome/CH-Api-Drive/README.md",
    order: 12,
  },
  {
    id: "ch-api-gateway",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-GateWay",
    docPath: "QVL-CustHome/CH-Api-GateWay/README.md",
    order: 13,
  },
  {
    id: "ch-tools",
    section: "custhome",
    parentId: "custhome",
    name: "Tools",
    docPath: "QVL-CustHome/Tools/README.md",
    store: false,
    status: "interne",
    order: 20,
  },

  {
    id: "toolbox",
    section: "toolbox",
    name: "QVL-ToolBox",
    docPath: "QVL-ToolBox/README.md",
    order: 0,
  },
  {
    id: "pipeboard",
    section: "toolbox",
    parentId: "toolbox",
    name: "PipeBoard",
    docPath: "QVL-ToolBox/PipeBoard/README.md",
    url: "https://tb-pipeboard.qvl-project.com",
    store: true,
    status: "live",
    order: 1,
  },
  {
    id: "canopui",
    section: "toolbox",
    parentId: "toolbox",
    name: "CanopUI",
    docPath: "QVL-CanopUI/README.md",
    url: "https://canopui.qvl-project.com",
    store: true,
    status: "live",
    order: 2,
  },
  {
    id: "aigate",
    section: "toolbox",
    parentId: "toolbox",
    name: "AIGate",
    docPath: "QVL-ToolBox/AIGate/README.md",
    order: 10,
  },
  {
    id: "healthserv",
    section: "toolbox",
    parentId: "toolbox",
    name: "HealthServ",
    docPath: "QVL-ToolBox/HealthServ/README.md",
    order: 11,
  },
  {
    id: "masterenv",
    section: "toolbox",
    parentId: "toolbox",
    name: "MasterEnv",
    docPath: "QVL-ToolBox/MasterEnv/README.md",
    order: 12,
  },
  {
    id: "missive",
    section: "toolbox",
    parentId: "toolbox",
    name: "Missive",
    docPath: "QVL-ToolBox/Missive/README.md",
    order: 13,
  },
  {
    id: "projectcenter",
    section: "toolbox",
    parentId: "toolbox",
    name: "ProjectCenter",
    docPath: "QVL-ProjectCenter/README.md",
    store: false,
    order: 14,
  },
  {
    id: "prviewer",
    section: "toolbox",
    parentId: "toolbox",
    name: "PrViewer",
    docPath: "QVL-ToolBox/PrViewer/README.md",
    order: 15,
  },
  {
    id: "relay",
    section: "toolbox",
    parentId: "toolbox",
    name: "Relay",
    docPath: "QVL-ToolBox/Relay/README.md",
    order: 16,
  },
  {
    id: "switch",
    section: "toolbox",
    parentId: "toolbox",
    name: "Switch",
    docPath: "QVL-ToolBox/Switch/README.md",
    order: 17,
  },
];

const LAST_ORDER = Number.MAX_SAFE_INTEGER;

function byOrder(first: { order?: number }, second: { order?: number }): number {
  return (first.order ?? LAST_ORDER) - (second.order ?? LAST_ORDER);
}

function sectionOrder(slug: SectionSlug): number {
  return getSection(slug)?.order ?? LAST_ORDER;
}

export function getSection(slug: string): Section | undefined {
  return SECTIONS.find((section) => section.slug === slug);
}

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((project) => project.id === id);
}

export function getStoreSections(): Section[] {
  return [...SECTIONS].sort(byOrder);
}

export function getStoreApps(slug: SectionSlug): Project[] {
  return PROJECTS.filter((project) => project.section === slug && project.store === true).sort(
    byOrder,
  );
}

export function getDocProjects(): Project[] {
  return [...PROJECTS].sort(
    (first, second) =>
      sectionOrder(first.section) - sectionOrder(second.section) || byOrder(first, second),
  );
}
