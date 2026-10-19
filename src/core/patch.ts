// The patch is plain serializable data. It never references physical ports.
// Setup = endpoints (logical names like "Keyboard", "Synth A", optionally bound to a device key).
// Scenes = named sets of routes between endpoints; exactly one scene is active (routed) at a time.

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

export type Scene = {
  id: string
  name: string
  edges: Edge[]
}

export type Patch = {
  endpoints: Endpoint[]
  scenes: Scene[]
  activeScene: string
}

export const emptyPatch: Patch = {
  endpoints: [],
  scenes: [{ id: 'scene-1', name: 'Scene 1', edges: [] }],
  activeScene: 'scene-1',
}

export const activeScene = (patch: Patch): Scene =>
  patch.scenes.find((s) => s.id === patch.activeScene) ?? patch.scenes[0]
