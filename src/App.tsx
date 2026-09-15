import { Outlet } from "react-router-dom";
import { PageScaffold } from "canopui";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { useDocumentLocale } from "./i18n";

const APP_NAME = "ProjectCenter";

export default function App() {
  const { items, activeHref, onNavigate } = useAppNavigation();
  useDocumentLocale();

  return (
    <PageScaffold
      navbarTitle={APP_NAME}
      items={items}
      activeHref={activeHref}
      onNavigate={onNavigate}
    >
      <Outlet />
    </PageScaffold>
  );
}
