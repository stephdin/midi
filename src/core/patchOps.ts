import { activeScene, type Endpoint, type Patch } from './patch'

// Convention for now: an endpoint per device, with the device key as its id.
export const deviceEndpoint = (key: string, label: string): Endpoint => ({
  id: key,
  label,
  device: key,
})

const ensure = (endpoints: Endpoint[], endpoint: Endpoint) =>
  endpoints.some((e) => e.id === endpoint.id) ? endpoints : [...endpoints, endpoint]

// Creates the route in the active scene if missing, otherwise flips `enabled` (so future per-route settings are kept).
export function toggleRoute(patch: Patch, from: Endpoint, to: Endpoint): Patch {
  const endpoints = ensure(ensure(patch.endpoints, from), to)
  const scene = activeScene(patch)
  const existing = scene.edges.find((e) => e.from === from.id && e.to === to.id)
  const edges = existing
    ? scene.edges.map((e) => (e === existing ? { ...e, enabled: !e.enabled } : e))
    : [
        ...scene.edges,
        { id: crypto.randomUUID(), from: from.id, to: to.id, enabled: true },
      ]
  return {
    ...patch,
    endpoints,
    scenes: patch.scenes.map((s) => (s === scene ? { ...s, edges } : s)),
  }
}

// Adds an empty scene and makes it active.
export function addScene(patch: Patch): Patch {
  const id = crypto.randomUUID()
  const name = `Scene ${patch.scenes.length + 1}`
  return { ...patch, scenes: [...patch.scenes, { id, name, edges: [] }], activeScene: id }
}

export const selectScene = (patch: Patch, id: string): Patch =>
  patch.scenes.some((s) => s.id === id) ? { ...patch, activeScene: id } : patch
