import { Outlet } from "react-router-dom";
import { PageScaffold } from "canopui";
import { useAppNavigation } from "./hooks/useAppNavigation";

export default function App() {
  const { items, activeHref, onNavigate } = useAppNavigation();

  return (
    <PageScaffold
      navbarTitle="ProjectCenter"
      items={items}
      activeHref={activeHref}
      onNavigate={onNavigate}
    >
      <Outlet />
    </PageScaffold>
  );
}
