import { useNavigate } from "react-router-dom";
import type { ChBreadcrumbItem } from "canopui";

export interface BreadcrumbCrumb {
  id: string;
  label: string;
  href?: string;
}

export function useBreadcrumbItems(crumbs: BreadcrumbCrumb[]): ChBreadcrumbItem[] {
  const navigate = useNavigate();

  return crumbs.map(({ id, label, href }) => ({
    id,
    label,
    onClick: href ? () => navigate(href) : undefined,
  }));
}
