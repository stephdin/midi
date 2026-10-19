import { useEffect, useState } from 'react'
import { router } from '../composition'
import type { Devices } from '../core/backend'
import { activeScene, type Patch } from '../core/patch'
import { deviceEndpoint, toggleRoute } from '../core/patchOps'
import type { EdgeStat } from '../core/router'

type Device = { key: string; label: string }

const unique = (devices: Device[]) => [
  ...new Map(devices.map((d) => [d.key, d])).values(),
]

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  devices: Devices
}

// Rows are sources, columns are destinations. Devices stay listed while unplugged if the patch uses them.
export function Matrix({ patch, setPatch, devices }: Props) {
  const [stats, setStats] = useState<EdgeStat[]>([])

  useEffect(() => {
    const t = setInterval(() => setStats(router.stats()), 250)
    return () => clearInterval(t)
  }, [])

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

  return (
    <section>
      <h2>Routes</h2>
      {rows.length === 0 || cols.length === 0 ? (
        <p>No devices</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>source \ destination</th>
              {cols.map((c) => (
                <th key={c.key}>
                  {c.label}
                  {!connected(c.key, devices.outputs) && ' (offline)'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key}>
                <th>
                  {r.label}
                  {!connected(r.key, devices.inputs) && ' (offline)'}
                </th>
                {cols.map((c) => {
                  const edge = activeScene(patch).edges.find((e) => e.from === r.key && e.to === c.key)
                  const stat = edge && stats.find((s) => s.id === edge.id)
                  return (
                    <td key={c.key}>
                      {r.key === c.key ? (
                        '-'
                      ) : (
                        <label>
                          <input
                            type="checkbox"
                            checked={edge?.enabled ?? false}
                            onChange={() =>
                              setPatch(
                                toggleRoute(
                                  patch,
                                  deviceEndpoint(r.key, r.label),
                                  deviceEndpoint(c.key, c.label),
                                ),
                              )
                            }
                          />
                          {edge?.enabled && ` ${stat?.active ? stat.count : 'offline'}`}
                        </label>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
