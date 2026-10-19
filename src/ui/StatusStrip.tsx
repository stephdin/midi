import { Group, Text } from '@mantine/core'
import type { Devices } from '../core/backend'
import { activeScene, type Patch } from '../core/patch'
import { Led } from './Led'
import { useRouterActivity } from './useRouterActivity'

// Always visible: one LED per connected device (lit while routed messages flow) and the active scene.
export function StatusStrip({ patch, devices }: { patch: Patch; devices: Devices }) {
  const { flowing } = useRouterActivity()
  const scene = activeScene(patch)

  const litDevices = new Set(
    scene.edges.filter((e) => flowing.has(e.id)).flatMap((e) => [e.from, e.to]),
  )
  const connected = new Map(
    [...devices.inputs, ...devices.outputs]
      .filter((p) => p.state === 'connected')
      .map((p) => [p.key, p.name]),
  )

  return (
    <Group gap="md">
      <Group gap={8}>
        {[...connected].map(([key, name]) => (
          <Led key={key} lit={litDevices.has(key)} label={name} />
        ))}
      </Group>
      <Text size="sm" c="dimmed">
        {scene.name}
      </Text>
    </Group>
  )
}
