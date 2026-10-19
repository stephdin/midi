import type { DeviceKey } from './patch'

export type PortInfo = {
  id: string
  // Stable identity (survives replugging, unlike the backend-specific id).
  key: DeviceKey
  name: string
  manufacturer: string
  version: string
  state: 'connected' | 'disconnected'
  connection: 'open' | 'closed' | 'pending'
}

export type Devices = {
  inputs: PortInfo[]
  outputs: PortInfo[]
  error: string | null
}

export type Send = (data: Uint8Array) => void

// Port: everything the core needs from a MIDI platform (Web MIDI today, maybe Tauri later).
export interface MidiBackend {
  readonly supported: boolean
  start(): Promise<void>
  // Immutable snapshot, replaced on every change (usable with useSyncExternalStore).
  getSnapshot(): Devices
  subscribe(fn: () => void): () => void
  // Replaces the handler for an input; null detaches. Unknown ids are ignored.
  listen(inputId: string, handler: ((data: Uint8Array) => void) | null): void
  // Resolved once at compile time so the hot path does no lookup.
  openOutput(outputId: string): Send | null
}
