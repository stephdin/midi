import { Button, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core'
import { activeScene, type Patch } from '../core/patch'
import { selectScene } from '../core/patchOps'
import { Led } from './Led'
import { useRouterActivity } from './useRouterActivity'

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  onOpenRouting: () => void
}

const routeCount = (n: number) => `${n} ${n === 1 ? 'route' : 'routes'}`

export function PerformanceScreen({ patch, setPatch, onOpenRouting }: Props) {
  const { stats, flowing } = useRouterActivity()
  const labels = new Map(patch.endpoints.map((e) => [e.id, e.label]))
  const routes = activeScene(patch).edges.filter((e) => e.enabled)

  return (
    <Stack gap={40}>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }}>
        {patch.scenes.map((scene) => {
          const active = scene.id === patch.activeScene
          return (
            <Paper
              key={scene.id}
              component="button"
              type="button"
              withBorder
              p="lg"
              h={110}
              onClick={() => setPatch(selectScene(patch, scene.id))}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                // Active = bright, inactive = dark.
                background: active ? 'var(--mantine-color-gray-0)' : 'transparent',
                color: active ? 'var(--mantine-color-dark-9)' : 'var(--mantine-color-dimmed)',
                borderColor: active ? 'var(--mantine-color-gray-0)' : undefined,
                transition: 'background 150ms, color 150ms',
              }}
            >
              <Stack justify="space-between" h="100%">
                <Text fw={600} fz="lg" c={active ? 'dark.9' : undefined}>
                  {scene.name}
                </Text>
                <Text size="sm" c={active ? 'dark.6' : 'dimmed'}>
                  {routeCount(scene.edges.filter((e) => e.enabled).length)}
                </Text>
              </Stack>
            </Paper>
          )
        })}
      </SimpleGrid>

      <Stack gap="xs">
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1}>
          Live
        </Text>
        {routes.length === 0 ? (
          <Group>
            <Text c="dimmed">This scene has no routes yet.</Text>
            <Button variant="default" size="xs" onClick={onOpenRouting}>
              Open Routing
            </Button>
          </Group>
        ) : (
          routes.map((edge) => {
            const stat = stats.find((s) => s.id === edge.id)
            const from = labels.get(edge.from) ?? edge.from
            const to = labels.get(edge.to) ?? edge.to
            return (
              <Paper key={edge.id} withBorder px="md" py="sm">
                <Group justify="space-between">
                  <Group gap="md">
                    <Led lit={flowing.has(edge.id)} label={from} size={12} />
                    <Text>
                      {from} → {to}
                    </Text>
                  </Group>
                  <Text ff="monospace" c={stat?.active ? undefined : 'dimmed'}>
                    {stat?.active ? stat.count : 'offline'}
                  </Text>
                </Group>
              </Paper>
            )
          })
        )}
      </Stack>
    </Stack>
  )
}
