import departementalIcon from "../assets/apps/departemental.svg";
import statbarIcon from "../assets/apps/statbar.svg";
import type { Project, Section, SectionSlug } from "./types";

export const SECTIONS: Section[] = [
  {
    slug: "hobbies",
    label: "QVL-Hobbies",
    order: 1,
    icon: "image",
    featured: true,
    tagline: "Les applis du quotidien, pensées pour le plaisir",
  },
  {
    slug: "custhome",
    label: "QVL-CustHome",
    order: 2,
    icon: "user",
    tagline: "Votre suite personnelle, réunie par un compte unique",
  },
  {
    slug: "toolbox",
    label: "QVL-ToolBox",
    order: 3,
    icon: "settings",
    tagline: "L'outillage interne qui fait tourner la flotte",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "hobbies",
    section: "hobbies",
    name: "QVL-Hobbies",
    description: "Applications de loisirs de la flotte QVL : bars, cocktails et jeux.",
    docPath: "QVL-Hobbies/README.md",
    order: 0,
  },
  {
    id: "hb-front-statbar",
    section: "hobbies",
    parentId: "hobbies",
    name: "StatBar",
    description:
      "Application de notation, de cartographie et de classement des bars visités.",
    tagline: "Notez, cartographiez et classez vos bars préférés",
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
    description:
      "Application de recettes de cocktails, de gestion du bar personnel et de favoris.",
    tagline: "Vos cocktails, votre bar, vos favoris",
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
    description:
      "Jeu de mémorisation des 101 départements français, de leur numéro et de leur position.",
    tagline: "Le jeu pour retenir les 101 départements français",
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
    description: "API des recettes de cocktails et des bars personnels de FondDeShaker.",
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
    description: "API des bars, des notes et des classements de StatBar.",
    docPath: "QVL-Hobbies/HB-Api-StatBar/README.md",
    status: "interne",
    order: 5,
  },

  {
    id: "custhome",
    section: "custhome",
    name: "QVL-CustHome",
    description: "Suite applicative CustHome : SSO, Drive, Budgy et services associés.",
    docPath: "QVL-CustHome/README.md",
    order: 0,
  },
  {
    id: "ch-portal-authenticator",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portal-Authenticator",
    description: "Portail de connexion et de gestion du compte (SSO).",
    tagline: "Connexion unique et gestion de votre compte",
    docPath: "QVL-CustHome/CH-Portal-Authenticator/README.md",
    url: "https://ch-auth.qvl-project.com",
    store: true,
    status: "live",
    order: 1,
  },
  {
    id: "ch-portail-admin",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Portail-Admin",
    description: "Portail d'administration des utilisateurs, rôles et accès.",
    tagline: "Administrez utilisateurs, rôles et accès",
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
    description: "Portail de stockage et de partage de fichiers.",
    tagline: "Stockez et partagez vos fichiers en toute sécurité",
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
    description: "Portail de suivi de budget et de dépenses.",
    tagline: "Suivez votre budget et vos dépenses au quotidien",
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
    description: "API d'authentification et de gestion des sessions.",
    docPath: "QVL-CustHome/CH-Api-Authenticator/README.md",
    order: 10,
  },
  {
    id: "ch-api-budgy",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Budgy",
    description: "API de suivi de budget et de dépenses.",
    docPath: "QVL-CustHome/CH-Api-Budgy/README.md",
    order: 11,
  },
  {
    id: "ch-api-drive",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-Drive",
    description: "API de stockage et de partage de fichiers.",
    docPath: "QVL-CustHome/CH-Api-Drive/README.md",
    order: 12,
  },
  {
    id: "ch-api-gateway",
    section: "custhome",
    parentId: "custhome",
    name: "CH-Api-GateWay",
    description: "Passerelle d'API et routage des services CustHome.",
    docPath: "QVL-CustHome/CH-Api-GateWay/README.md",
    order: 13,
  },
  {
    id: "ch-tools",
    section: "custhome",
    parentId: "custhome",
    name: "Tools",
    description: "Outillage transverse de la suite CustHome.",
    tagline: "L'outillage transverse de la suite CustHome",
    docPath: "QVL-CustHome/Tools/README.md",
    store: true,
    status: "interne",
    order: 20,
  },

  {
    id: "toolbox",
    section: "toolbox",
    name: "QVL-ToolBox",
    description: "Boîte à outils et services internes de la flotte QVL.",
    docPath: "QVL-ToolBox/README.md",
    order: 0,
  },
  {
    id: "pipeboard",
    section: "toolbox",
    parentId: "toolbox",
    name: "PipeBoard",
    description: "Tableau de bord des pipelines et de l'outillage interne.",
    tagline: "Pilotez les pipelines et l'outillage de la flotte",
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
    description: "Vitrine du design system React de la flotte QVL.",
    tagline: "Le design system React de la flotte, en vitrine",
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
    description: "Passerelle unifiée vers les fournisseurs d'IA.",
    docPath: "QVL-ToolBox/AIGate/README.md",
    order: 10,
  },
  {
    id: "healthserv",
    section: "toolbox",
    parentId: "toolbox",
    name: "HealthServ",
    description: "Supervision de la santé des services.",
    docPath: "QVL-ToolBox/HealthServ/README.md",
    order: 11,
  },
  {
    id: "masterenv",
    section: "toolbox",
    parentId: "toolbox",
    name: "MasterEnv",
    description: "Registre centralisé des ports et variables d'environnement.",
    docPath: "QVL-ToolBox/MasterEnv/README.md",
    order: 12,
  },
  {
    id: "missive",
    section: "toolbox",
    parentId: "toolbox",
    name: "Missive",
    description: "Service d'envoi et de suivi des notifications.",
    docPath: "QVL-ToolBox/Missive/README.md",
    order: 13,
  },
  {
    id: "projectcenter",
    section: "toolbox",
    parentId: "toolbox",
    name: "ProjectCenter",
    description: "Catalogue et documentation des projets de la flotte QVL.",
    docPath: "QVL-ProjectCenter/README.md",
    store: false,
    order: 14,
  },
  {
    id: "prviewer",
    section: "toolbox",
    parentId: "toolbox",
    name: "PrViewer",
    description: "Revue et visualisation des pull requests.",
    docPath: "QVL-ToolBox/PrViewer/README.md",
    order: 15,
  },
  {
    id: "relay",
    section: "toolbox",
    parentId: "toolbox",
    name: "Relay",
    description: "Relais de messages entre services de la flotte.",
    docPath: "QVL-ToolBox/Relay/README.md",
    order: 16,
  },
  {
    id: "switch",
    section: "toolbox",
    parentId: "toolbox",
    name: "Switch",
    description: "Aiguillage et bascule de trafic entre environnements.",
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
