import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { HomePage } from "./pages/HomePage";
import { SectionPage } from "./pages/SectionPage";
import { ProjectDocPage } from "./pages/ProjectDocPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ":section", element: <SectionPage /> },
      { path: ":section/:project", element: <ProjectDocPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
