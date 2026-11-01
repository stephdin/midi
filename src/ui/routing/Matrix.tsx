import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Devices } from '@/core/backend'
import { activeScene, type Patch } from '@/core/patch'
import { deviceEndpoint, toggleRoute } from '@/core/patchOps'
import { useRouterActivity } from '@/ui/shared/useRouterActivity'

type Device = { key: string; label: string }

const unique = (devices: Device[]) => [
  ...new Map(devices.map((d) => [d.key, d])).values(),
]

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  devices: Devices
}

const cell = 'flex h-9 w-[72px] items-center justify-center rounded-sm font-mono text-sm'
// No row borders or hover tint: the cells carry all the state.
const row = 'border-0 hover:bg-transparent'

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
    return <p className="text-muted-foreground">No devices</p>
  }

  return (
    <Table className="w-auto">
      <TableHeader className="[&_tr]:border-0">
        <TableRow className={row}>
          <TableHead />
          {cols.map((c) => (
            <TableHead
              key={c.key}
              className={cn(
                'px-1 text-center',
                !connected(c.key, devices.outputs) && 'text-muted-foreground',
              )}
            >
              {c.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.key} className={row}>
            <TableHead
              scope="row"
              className={cn('pr-3', !connected(r.key, devices.inputs) && 'text-muted-foreground')}
            >
              {r.label}
            </TableHead>
            {cols.map((c) => {
              if (r.key === c.key) {
                return (
                  <TableCell key={c.key} className="p-1">
                    <div className={cn(cell, 'text-marker')}>–</div>
                  </TableCell>
                )
              }
              const edge = edges.find((e) => e.from === r.key && e.to === c.key)
              const on = edge?.enabled ?? false
              const stat = edge && stats.find((s) => s.id === edge.id)
              return (
                <TableCell key={c.key} className="p-1">
                  <button
                    type="button"
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
                    className={cn(
                      cell,
                      'cursor-pointer border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                      on
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-marker bg-transparent text-marker hover:bg-accent',
                      on && !stat?.active && 'border-dashed',
                    )}
                  >
                    {on ? (stat?.active ? stat.count : 'off') : ''}
                  </button>
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
