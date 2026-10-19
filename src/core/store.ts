import type { Edge, Endpoint, Patch } from './patch'

// Port: where the patch is persisted (localStorage today, maybe the filesystem via Tauri later).
export interface PatchStore {
  load(): Promise<Patch | null>
  save(patch: Patch): Promise<void>
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null

const isEndpoint = (v: unknown): v is Endpoint =>
  isObject(v) &&
  typeof v.id === 'string' &&
  typeof v.label === 'string' &&
  (v.device === null || typeof v.device === 'string')

const isEdge = (v: unknown): v is Edge =>
  isObject(v) &&
  typeof v.id === 'string' &&
  typeof v.from === 'string' &&
  typeof v.to === 'string' &&
  typeof v.enabled === 'boolean'

// Validates untrusted data (storage, future import files). Returns null if it is not a patch.
export function parsePatch(value: unknown): Patch | null {
  if (!isObject(value)) return null
  const { endpoints, edges } = value
  if (!Array.isArray(endpoints) || !Array.isArray(edges)) return null
  if (!endpoints.every(isEndpoint) || !edges.every(isEdge)) return null
  return { endpoints, edges }
}
