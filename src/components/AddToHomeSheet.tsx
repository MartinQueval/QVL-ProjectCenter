import {
  BulletList,
  Button,
  Icon,
  Link,
  SidePanel,
  Stack,
  Text,
  useTranslation,
  type CanopBulletListItem,
  type CanopTranslate,
} from "canopui";
import type { AddToHomeInstructions } from "../lib/desktopShortcut";

export interface AddToHomeSheetProps {
  open: boolean;
  appName: string;
  url: string;
  instructions: AddToHomeInstructions;
  onClose: () => void;
  onCopyLink: () => void;
}

function toBulletItems(t: CanopTranslate, stepKeys: readonly string[]): CanopBulletListItem[] {
  return stepKeys.map((key) => ({ key, content: t(key) }));
}

export function AddToHomeSheet({
  open,
  appName,
  url,
  instructions,
  onClose,
  onCopyLink,
}: AddToHomeSheetProps) {
  const { t } = useTranslation();

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={t("shortcut.sheet.title", { name: appName })}
      actions={
        <Button
          variant="secondary"
          onClick={onCopyLink}
          startIcon={<Icon name="copy" size="sm" color="inherit" />}
        >
          {t("shortcut.sheet.copy")}
        </Button>
      }
    >
      <Stack gap="lg">
        <Text variant="body-sm" tone="muted">
          {t("shortcut.sheet.intro")}
        </Text>

        <Stack gap="sm">
          <Text variant="label" weight="semibold">
            {t(instructions.titleKey)}
          </Text>
          <BulletList items={toBulletItems(t, instructions.stepKeys)} />
        </Stack>

        <Stack gap="sm">
          <Text variant="label" weight="semibold">
            {t("shortcut.sheet.linkLabel")}
          </Text>
          <Link href={url} size="small">
            {url}
          </Link>
        </Stack>
      </Stack>
    </SidePanel>
  );
}
