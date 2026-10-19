// Composition root: the only place that picks concrete adapters.
import { LocalStoragePatchStore } from './adapters/localStorageStore'
import { WebMidiBackend } from './adapters/webmidi'
import { Router } from './core/router'

export const backend = new WebMidiBackend()
export const router = new Router(backend)
export const store = new LocalStoragePatchStore()
