import { Badge, Card, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import type { Devices, PortInfo } from '../core/backend'
import { deviceGroup } from './deviceGroups'
import { Led } from './Led'

type Device = { name: string; inputs: PortInfo[]; outputs: PortInfo[] }

// One entry per physical device: all its input and output ports together.
function groupDevices(devices: Devices): Device[] {
  const groups = new Map<string, Device>()
  const group = (p: PortInfo) => {
    const name = deviceGroup(p.name)
    if (!groups.has(name)) groups.set(name, { name, inputs: [], outputs: [] })
    return groups.get(name)!
  }
  devices.inputs.forEach((p) => group(p).inputs.push(p))
  devices.outputs.forEach((p) => group(p).outputs.push(p))
  return [...groups.values()]
}

function Ports({ title, ports }: { title: string; ports: PortInfo[] }) {
  if (ports.length === 0) return null
  return (
    <Group gap={6} wrap="wrap">
      <Text size="xs" c="dimmed" w={32}>
        {title}
      </Text>
      {ports.map((p) => (
        <Badge key={p.id} variant="outline" color="gray" tt="none" fw={400}>
          {p.name}
        </Badge>
      ))}
    </Group>
  )
}

export function ConfigurationScreen({ devices }: { devices: Devices }) {
  const list = groupDevices(devices)

  if (list.length === 0) return <Text c="dimmed">No devices connected</Text>

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {list.map((d) => {
        const online = [...d.inputs, ...d.outputs].some((p) => p.state === 'connected')
        return (
          <Card key={d.name} withBorder padding="md">
            <Stack gap="sm">
              <Group gap="sm">
                <Led lit={online} label={online ? 'Online' : 'Offline'} size={12} />
                <Text fw={600}>{d.name}</Text>
              </Group>
              <Ports title="In" ports={d.inputs} />
              <Ports title="Out" ports={d.outputs} />
            </Stack>
          </Card>
        )
      })}
    </SimpleGrid>
  )
}
