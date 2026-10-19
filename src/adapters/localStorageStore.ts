import type { Patch } from '../core/patch'
import { parsePatch, type PatchStore } from '../core/store'

const KEY = 'midi-patcher:patch'

export class LocalStoragePatchStore implements PatchStore {
  async load(): Promise<Patch | null> {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    try {
      return parsePatch(JSON.parse(raw))
    } catch {
      return null
    }
  }

  async save(patch: Patch): Promise<void> {
    localStorage.setItem(KEY, JSON.stringify(patch))
  }
}
