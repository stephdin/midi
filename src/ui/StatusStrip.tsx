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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {[...connected].map(([key, name]) => (
          <Led key={key} lit={litDevices.has(key)} label={name} />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">{scene.name}</span>
    </div>
  )
}
