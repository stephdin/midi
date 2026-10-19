import { useState } from 'react'
import {
  Box,
  Button,
  Group,
  NavLink,
  SegmentedControl,
  Stack,
  Text,
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
    <Group align="flex-start" wrap="nowrap" gap="xl">
      <Box w={200} style={{ flexShrink: 0 }}>
        <Stack gap={4}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1} mb={4}>
            Scenes
          </Text>
          {patch.scenes.map((scene) => (
            <NavLink
              key={scene.id}
              label={scene.name}
              variant="filled"
              // The filled background is near-white, so force dark text on the active scene.
              styles={scene.id === patch.activeScene ? { label: { color: 'var(--mantine-color-dark-9)' } } : undefined}
              active={scene.id === patch.activeScene}
              onClick={() => setPatch(selectScene(patch, scene.id))}
            />
          ))}
          <Button
            variant="default"
            size="xs"
            mt="xs"
            leftSection={<IconPlus size={14} />}
            onClick={() => setPatch(addScene(patch))}
          >
            Add scene
          </Button>
        </Stack>
      </Box>
      <Box style={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
        <Group justify="space-between" mb="lg">
          <Text fw={600} fz="lg">
            {activeScene(patch).name}
          </Text>
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
