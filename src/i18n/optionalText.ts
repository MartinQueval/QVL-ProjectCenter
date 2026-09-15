import type { CanopTranslate } from "canopui";

export function optionalText(t: CanopTranslate, key: string): string | undefined {
  const value = t(key);
  return value === key ? undefined : value;
}
