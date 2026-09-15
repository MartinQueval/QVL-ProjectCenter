import {
  BulletList,
  Button,
  Icon,
  Link,
  SidePanel,
  Stack,
  Text,
  type CanopBulletListItem,
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

function toBulletItems(steps: readonly string[]): CanopBulletListItem[] {
  return steps.map((step, index) => ({ key: `step-${index}`, content: step }));
}

export function AddToHomeSheet({
  open,
  appName,
  url,
  instructions,
  onClose,
  onCopyLink,
}: AddToHomeSheetProps) {
  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={`Ajouter ${appName} à l'écran d'accueil`}
      actions={
        <Button
          variant="secondary"
          onClick={onCopyLink}
          startIcon={<Icon name="copy" size="sm" color="inherit" />}
        >
          Copier le lien
        </Button>
      }
    >
      <Stack gap="lg">
        <Text variant="body-sm" tone="muted">
          Aucun navigateur ne laisse un site en ajouter un autre à votre écran d&apos;accueil. Le
          geste vous revient — il tient en quelques secondes.
        </Text>

        <Stack gap="sm">
          <Text variant="label" weight="semibold">
            {instructions.title}
          </Text>
          <BulletList items={toBulletItems(instructions.steps)} />
        </Stack>

        <Stack gap="sm">
          <Text variant="label" weight="semibold">
            Lien de l&apos;application
          </Text>
          <Link href={url} size="small">
            {url}
          </Link>
        </Stack>
      </Stack>
    </SidePanel>
  );
}
