import { useState } from 'react'
import {
  Box,
  Button,
  Group,
  NavLink,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import type { Devices } from '../core/backend'
import { activeScene, type Patch } from '../core/patch'
import { addScene, selectScene } from '../core/patchOps'
import { Matrix } from './Matrix'

type View = 'matrix' | 'graph'

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  devices: Devices
}

export function RoutingScreen({ patch, setPatch, devices }: Props) {
  const [view, setView] = useState<View>('matrix')

  return (
    <Group align="flex-start" wrap="nowrap" gap="md">
      <Paper withBorder p="xs" w={220} style={{ flexShrink: 0 }}>
        <Stack gap={4}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="xs">
            Scenes
          </Text>
          {patch.scenes.map((scene) => (
            <NavLink
              key={scene.id}
              label={scene.name}
              active={scene.id === patch.activeScene}
              onClick={() => setPatch(selectScene(patch, scene.id))}
            />
          ))}
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconPlus size={14} />}
            onClick={() => setPatch(addScene(patch))}
          >
            Add scene
          </Button>
        </Stack>
      </Paper>
      <Box style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
        <Group justify="space-between" mb="sm">
          <Title order={4}>{activeScene(patch).name}</Title>
          <SegmentedControl
            value={view}
            onChange={(v) => setView(v as View)}
            data={[
              { value: 'matrix', label: 'Matrix' },
              { value: 'graph', label: 'Graph' },
            ]}
          />
        </Group>
        {view === 'matrix' ? (
          <Matrix patch={patch} setPatch={setPatch} devices={devices} />
        ) : (
          <Text c="dimmed">graph here</Text>
        )}
      </Box>
    </Group>
  )
}
