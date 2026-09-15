import { Stack } from "canopui";
import type { DocSectionGroup } from "../pages/useDocIndexPage";
import { DocSectionGroupBlock } from "./DocSectionGroupBlock";

export interface DocSectionListProps {
  groups: DocSectionGroup[];
}

export function DocSectionList({ groups }: DocSectionListProps) {
  return (
    <Stack gap="xl">
      {groups.map((group) => (
        <DocSectionGroupBlock key={group.section.slug} group={group} />
      ))}
    </Stack>
  );
}
