import type { Devices, PortInfo } from './backend'
import { activeScene, type DeviceKey, type Patch } from './patch'

export type Route = {
  inputId: string
  outputIds: string[]
  // Index into the active scene's edges for each output (used for stats).
  edges: number[]
}

export type Compiled = {
  routes: Route[]
  edgeIds: string[]
  // Per edge: whether both ends currently resolve to connected ports.
  active: boolean[]
}

const find = (ports: PortInfo[], key: DeviceKey) =>
  ports.find((p) => p.state === 'connected' && p.key === key)

// Pure: active scene + live devices -> flat input -> outputs lookup.
export function compile(patch: Patch, devices: Devices): Compiled {
  const { edges } = activeScene(patch)
  const byId = new Map(patch.endpoints.map((e) => [e.id, e]))
  const routes = new Map<string, Route>()
  const active = edges.map(() => false)

  edges.forEach((edge, i) => {
    const from = byId.get(edge.from)?.device
    const to = byId.get(edge.to)?.device
    // Same device on both ends would be a feedback loop.
    if (!edge.enabled || !from || !to || from === to) return
    const input = find(devices.inputs, from)
    const output = find(devices.outputs, to)
    if (!input || !output) return

    let route = routes.get(input.id)
    if (!route) routes.set(input.id, (route = { inputId: input.id, outputIds: [], edges: [] }))
    route.outputIds.push(output.id)
    route.edges.push(i)
    active[i] = true
  })

  return {
    routes: [...routes.values()],
    edgeIds: edges.map((e) => e.id),
    active,
  }
}
