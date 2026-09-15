import type { CanopBreadcrumbItem } from "canopui";
import type { Project } from "../data/types";
import { DOC_PATH, STORE_PATH } from "./useAppNavigation";
import { useBreadcrumbItems, type BreadcrumbCrumb } from "./useBreadcrumbItems";

export function useDocBreadcrumbItems(project?: Project): CanopBreadcrumbItem[] {
  const crumbs: BreadcrumbCrumb[] = [
    { id: "home", label: "Accueil", href: STORE_PATH },
    { id: "doc", label: "Documentation", href: project ? DOC_PATH : undefined },
    ...(project ? [{ id: project.id, label: project.name }] : []),
  ];

  return useBreadcrumbItems(crumbs);
}
