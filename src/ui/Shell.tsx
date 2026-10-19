import type { ReactNode } from "react";
import { Container, Group, Tabs, Text } from "@mantine/core";
import {
  IconActivity,
  IconPlugConnected,
  IconRoute,
  type Icon,
} from "@tabler/icons-react";

export type Screen = "performance" | "routing" | "configuration";

const screens: { id: Screen; label: string; icon: Icon }[] = [
  { id: "performance", label: "Performance", icon: IconActivity },
  { id: "routing", label: "Routing", icon: IconRoute },
  { id: "configuration", label: "Configuration", icon: IconPlugConnected },
];

type Props = {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  status: ReactNode;
  children: ReactNode;
};

export function Shell({ screen, onNavigate, status, children }: Props) {
  return (
    <Container size="lg" py="lg">
      <Group justify="space-between" mb="lg">
        <Text fw={700} fz="lg" lts={1}>
          MIDI Patcher
        </Text>
        {status}
      </Group>
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
      <div style={{ paddingTop: "var(--mantine-spacing-xl)" }}>{children}</div>
    </Container>
  );
}
