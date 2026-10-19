import type { Endpoint, Patch } from './patch'

// Convention for now: an endpoint per device, with the device key as its id.
export const deviceEndpoint = (key: string, label: string): Endpoint => ({
  id: key,
  label,
  device: key,
})

const ensure = (endpoints: Endpoint[], endpoint: Endpoint) =>
  endpoints.some((e) => e.id === endpoint.id) ? endpoints : [...endpoints, endpoint]

// Creates the route if missing, otherwise flips `enabled` (so future per-route settings are kept).
export function toggleRoute(patch: Patch, from: Endpoint, to: Endpoint): Patch {
  const endpoints = ensure(ensure(patch.endpoints, from), to)
  const existing = patch.edges.find((e) => e.from === from.id && e.to === to.id)
  const edges = existing
    ? patch.edges.map((e) => (e === existing ? { ...e, enabled: !e.enabled } : e))
    : [
        ...patch.edges,
        { id: crypto.randomUUID(), from: from.id, to: to.id, enabled: true },
      ]
  return { endpoints, edges }
}
