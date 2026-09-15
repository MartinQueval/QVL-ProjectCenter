import { lazy } from "react";

export const DocIndexPage = lazy(() =>
  import("./DocIndexPage").then(({ DocIndexPage: component }) => ({ default: component })),
);

export const ProjectDocPage = lazy(() =>
  import("./ProjectDocPage").then(({ ProjectDocPage: component }) => ({ default: component })),
);
