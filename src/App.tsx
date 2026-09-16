import { Outlet } from "react-router-dom";
import { PageScaffold } from "canopui";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { usePageHeader } from "./hooks/usePageHeader";
import { useDocumentLocale } from "./i18n";

const APP_NAME = "ProjectCenter";

export default function App() {
  const { items, activeHref, onNavigate } = useAppNavigation();
  const { title, subtitle } = usePageHeader();
  useDocumentLocale();

  return (
    <PageScaffold
      title={title}
      subtitle={subtitle}
      navbarTitle={APP_NAME}
      items={items}
      activeHref={activeHref}
      onNavigate={onNavigate}
    >
      <Outlet />
    </PageScaffold>
  );
}
