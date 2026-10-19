import type { Devices, MidiBackend, PortInfo, Send } from '../core/backend'

// Port ids are index based and change when devices are replugged, so identity is manufacturer + name.
const toInfo = (p: MIDIPort): PortInfo => ({
  id: p.id,
  key: `${p.manufacturer ?? ''}|${p.name ?? ''}`,
  name: p.name ?? 'Unknown',
  manufacturer: p.manufacturer ?? '',
  version: p.version ?? '',
  state: p.state,
  connection: p.connection,
})

export class WebMidiBackend implements MidiBackend {
  readonly supported =
    typeof navigator !== 'undefined' && !!navigator.requestMIDIAccess

  private access: MIDIAccess | null = null
  private starting: Promise<void> | null = null
  private listeners = new Set<() => void>()
  private snapshot: Devices = { inputs: [], outputs: [], error: null }

  start(): Promise<void> {
    if (!this.supported) return Promise.resolve()
    this.starting ??= navigator
      .requestMIDIAccess()
      .then((access) => {
        this.access = access
        access.onstatechange = () => this.changed()
        this.changed()
      })
      .catch((e: unknown) => this.changed(String(e)))
    return this.starting
  }

  getSnapshot = (): Devices => this.snapshot

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  listen(inputId: string, handler: ((data: Uint8Array) => void) | null) {
    const input = this.access?.inputs.get(inputId)
    if (!input) return
    input.onmidimessage = handler
      ? (e) => {
          if (e.data) handler(e.data)
        }
      : null
  }

  openOutput(outputId: string): Send | null {
    const output = this.access?.outputs.get(outputId)
    return output ? (data) => output.send(data) : null
  }

  private changed(error: string | null = null) {
    const access = this.access
    this.snapshot = {
      inputs: access ? [...access.inputs.values()].map(toInfo) : [],
      outputs: access ? [...access.outputs.values()].map(toInfo) : [],
      error,
    }
    this.listeners.forEach((fn) => fn())
  }
}
