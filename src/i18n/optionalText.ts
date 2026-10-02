import type { CanopTranslate } from "@canop/ui";

export function optionalText(t: CanopTranslate, key: string): string | undefined {
  const value = t(key);
  return value === key ? undefined : value;
}
