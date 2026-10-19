import type { MidiBackend, Send } from './backend'
import { compile } from './compile'
import { emptyPatch, type Patch } from './patch'

export type EdgeStat = { id: string; active: boolean; count: number }

// Applies a compiled patch to a backend. The hot path (one handler per input) allocates
// nothing and never touches React.
export class Router {
  private backend: MidiBackend
  private patch: Patch = emptyPatch
  private attached = new Set<string>()
  private edgeIds: string[] = []
  private active: boolean[] = []
  private counts = new Uint32Array(0)

  constructor(backend: MidiBackend) {
    this.backend = backend
    backend.subscribe(() => this.apply())
  }

  setPatch(patch: Patch) {
    this.patch = patch
    this.apply()
  }

  // Cheap snapshot meant to be polled by the UI a few times per second.
  stats(): EdgeStat[] {
    return this.edgeIds.map((id, i) => ({
      id,
      active: this.active[i],
      count: this.counts[i],
    }))
  }

  private apply() {
    const compiled = compile(this.patch, this.backend.getSnapshot())
    const counts = new Uint32Array(compiled.edgeIds.length)
    const nowAttached = new Set<string>()

    for (const route of compiled.routes) {
      const sends: Send[] = []
      const idx: number[] = []
      route.outputIds.forEach((id, k) => {
        const send = this.backend.openOutput(id)
        if (send) {
          sends.push(send)
          idx.push(route.edges[k])
        } else {
          compiled.active[route.edges[k]] = false
        }
      })
      if (sends.length === 0) continue

      const n = sends.length
      this.backend.listen(route.inputId, (data) => {
        for (let i = 0; i < n; i++) {
          sends[i](data)
          counts[idx[i]]++
        }
      })
      nowAttached.add(route.inputId)
    }

    for (const id of this.attached) {
      if (!nowAttached.has(id)) this.backend.listen(id, null)
    }

    this.attached = nowAttached
    this.edgeIds = compiled.edgeIds
    this.active = compiled.active
    this.counts = counts
  }
}
