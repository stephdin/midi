// The patch is plain serializable data. It never references physical ports:
// endpoints are logical ("Keyboard", "Synth A") and optionally bound to a device key.

export type DeviceKey = string

export type Endpoint = {
  id: string
  label: string
  device: DeviceKey | null
}

export type Edge = {
  id: string
  from: string
  to: string
  enabled: boolean
}

export type Patch = {
  endpoints: Endpoint[]
  edges: Edge[]
}

export const emptyPatch: Patch = { endpoints: [], edges: [] }
