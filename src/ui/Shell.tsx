import type { ReactNode } from "react";
import { Container, Tabs } from "@mantine/core";
import {
  IconActivity,
  IconPlugConnected,
  IconRoute,
  type Icon,
} from "@tabler/icons-react";

export type Screen = "routing" | "configuration" | "performance";

const screens: { id: Screen; label: string; icon: Icon }[] = [
  { id: "configuration", label: "Configuration", icon: IconPlugConnected },
  { id: "routing", label: "Routing", icon: IconRoute },
  { id: "performance", label: "Performance", icon: IconActivity },
];

type Props = {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  children: ReactNode;
};

export function Shell({ screen, onNavigate, children }: Props) {
  return (
    <Container size="lg" py="md">
      <Tabs
        variant="outline"
        value={screen}
        onChange={(v) => v && onNavigate(v as Screen)}
      >
        <Tabs.List>
          {screens.map(({ id, label, icon: ScreenIcon }) => (
            <Tabs.Tab
              key={id}
              value={id}
              leftSection={<ScreenIcon size={16} />}
            >
              {label}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <div style={{ paddingTop: "var(--mantine-spacing-md)" }}>{children}</div>
    </Container>
  );
}
