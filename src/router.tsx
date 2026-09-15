import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import App from "./App";
import { DocRouteError } from "./components/DocRouteError";
import { SECTIONS } from "./data/projects";
import { DocLayout } from "./pages/DocLayout";
import { HomePage } from "./pages/HomePage";
import { LegacyDocRedirect } from "./pages/LegacyDocRedirect";
import { DocIndexPage, ProjectDocPage } from "./pages/lazyDocPages";

const legacySectionRoutes: RouteObject[] = SECTIONS.flatMap((section) => [
  { path: section.slug, element: <Navigate to="/" replace /> },
  { path: `${section.slug}/:projectId`, element: <LegacyDocRedirect /> },
]);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "doc",
        element: <DocLayout />,
        errorElement: <DocRouteError />,
        children: [
          { index: true, element: <DocIndexPage /> },
          { path: ":projectId", element: <ProjectDocPage /> },
        ],
      },
      ...legacySectionRoutes,
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
