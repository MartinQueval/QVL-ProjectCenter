import { lazy } from "react";

function loadAddToHomeSheet() {
  return import("./AddToHomeSheet").then(({ AddToHomeSheet: component }) => ({
    default: component,
  }));
}

export const AddToHomeSheet = lazy(loadAddToHomeSheet);

export function preloadAddToHomeSheet(): Promise<unknown> {
  return loadAddToHomeSheet();
}
