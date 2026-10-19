import { Stack, Table, Text, Title } from '@mantine/core'
import type { Devices, PortInfo } from '../core/backend'

function PortTable({ title, ports }: { title: string; ports: PortInfo[] }) {
  return (
    <Stack gap="xs">
      <Title order={4}>{title}</Title>
      {ports.length === 0 ? (
        <Text c="dimmed">No devices connected</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Manufacturer</Table.Th>
              <Table.Th>State</Table.Th>
              <Table.Th>Connection</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {ports.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.name}</Table.Td>
                <Table.Td>{p.manufacturer || '(empty)'}</Table.Td>
                <Table.Td>{p.state}</Table.Td>
                <Table.Td>{p.connection}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  )
}

export function ConfigurationScreen({ devices }: { devices: Devices }) {
  return (
    <Stack>
      <Title order={2}>Configuration</Title>
      <PortTable title="Inputs" ports={devices.inputs} />
      <PortTable title="Outputs" ports={devices.outputs} />
    </Stack>
  )
}
