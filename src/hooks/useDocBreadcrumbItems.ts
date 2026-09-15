import { useTranslation, type CanopBreadcrumbItem } from "canopui";
import type { Project } from "../data/types";
import { DOC_PATH, STORE_PATH } from "./useAppNavigation";
import { useBreadcrumbItems, type BreadcrumbCrumb } from "./useBreadcrumbItems";

export function useDocBreadcrumbItems(project?: Project): CanopBreadcrumbItem[] {
  const { t } = useTranslation();

  const crumbs: BreadcrumbCrumb[] = [
    { id: "home", label: t("doc.breadcrumb.home"), href: STORE_PATH },
    { id: "doc", label: t("doc.breadcrumb.doc"), href: project ? DOC_PATH : undefined },
    ...(project ? [{ id: project.id, label: project.name }] : []),
  ];

  return useBreadcrumbItems(crumbs);
}
