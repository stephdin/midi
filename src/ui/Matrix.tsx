import { Table, Text, UnstyledButton } from '@mantine/core'
import type { Devices } from '../core/backend'
import { activeScene, type Patch } from '../core/patch'
import { deviceEndpoint, toggleRoute } from '../core/patchOps'
import { useRouterActivity } from './useRouterActivity'

type Device = { key: string; label: string }

const unique = (devices: Device[]) => [
  ...new Map(devices.map((d) => [d.key, d])).values(),
]

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  devices: Devices
}

const cell = {
  width: 72,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--mantine-radius-sm)',
  fontFamily: 'var(--mantine-font-family-monospace)',
  fontSize: 'var(--mantine-font-size-sm)',
}

// Rows are sources, columns are destinations. Devices stay listed while unplugged if the patch uses them.
// A route that is on is a bright cell, off is a dark outline.
export function Matrix({ patch, setPatch, devices }: Props) {
  const { stats } = useRouterActivity()
  const edges = activeScene(patch).edges

  const known = patch.endpoints.flatMap((e) =>
    e.device ? [{ key: e.device, label: e.label }] : [],
  )
  const rows = unique([
    ...devices.inputs.map((p) => ({ key: p.key, label: p.name })),
    ...known,
  ])
  const cols = unique([
    ...devices.outputs.map((p) => ({ key: p.key, label: p.name })),
    ...known,
  ])

  const connected = (key: string, ports: Devices['inputs']) =>
    ports.some((p) => p.key === key && p.state === 'connected')

  if (rows.length === 0 || cols.length === 0) {
    return <Text c="dimmed">No devices</Text>
  }

  return (
    <Table withRowBorders={false} verticalSpacing={4} horizontalSpacing="xs" w="auto">
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          {cols.map((c) => (
            <Table.Th key={c.key} ta="center" fw={500}>
              <Text size="sm" c={connected(c.key, devices.outputs) ? undefined : 'dimmed'}>
                {c.label}
              </Text>
            </Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((r) => (
          <Table.Tr key={r.key}>
            <Table.Th fw={500}>
              <Text size="sm" c={connected(r.key, devices.inputs) ? undefined : 'dimmed'}>
                {r.label}
              </Text>
            </Table.Th>
            {cols.map((c) => {
              if (r.key === c.key) {
                return (
                  <Table.Td key={c.key}>
                    <div style={{ ...cell, color: 'var(--mantine-color-dark-3)' }}>–</div>
                  </Table.Td>
                )
              }
              const edge = edges.find((e) => e.from === r.key && e.to === c.key)
              const on = edge?.enabled ?? false
              const stat = edge && stats.find((s) => s.id === edge.id)
              return (
                <Table.Td key={c.key}>
                  <UnstyledButton
                    aria-pressed={on}
                    aria-label={`${r.label} to ${c.label}`}
                    onClick={() =>
                      setPatch(
                        toggleRoute(
                          patch,
                          deviceEndpoint(r.key, r.label),
                          deviceEndpoint(c.key, c.label),
                        ),
                      )
                    }
                    style={{
                      ...cell,
                      background: on ? 'var(--mantine-color-gray-0)' : 'transparent',
                      color: on ? 'var(--mantine-color-dark-9)' : 'var(--mantine-color-dark-3)',
                      border: `1px ${on && !stat?.active ? 'dashed' : 'solid'} ${
                        on ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-dark-3)'
                      }`,
                    }}
                  >
                    {on ? (stat?.active ? stat.count : 'off') : ''}
                  </UnstyledButton>
                </Table.Td>
              )
            })}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}
