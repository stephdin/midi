import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Devices, PortInfo } from '@/core/backend'
import { deviceGroup } from './deviceGroups'
import { Led } from '@/ui/shared/Led'

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
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-8 text-xs text-muted-foreground">{title}</span>
      {ports.map((p) => (
        <Badge key={p.id} variant="outline" className="font-normal">
          {p.name}
        </Badge>
      ))}
    </div>
  )
}

export function ConfigurationScreen({ devices }: { devices: Devices }) {
  const list = groupDevices(devices)

  if (list.length === 0) return <p className="text-muted-foreground">No devices connected</p>

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {list.map((d) => {
        const online = [...d.inputs, ...d.outputs].some((p) => p.state === 'connected')
        return (
          <Card key={d.name} className="gap-3 p-4">
            <div className="flex items-center gap-3">
              <Led lit={online} label={online ? 'Online' : 'Offline'} size={12} />
              <span className="font-semibold">{d.name}</span>
            </div>
            <Ports title="In" ports={d.inputs} />
            <Ports title="Out" ports={d.outputs} />
          </Card>
        )
      })}
    </div>
  )
}
