import { useEffect, useState, useSyncExternalStore } from 'react'
import { backend, router, store } from '../composition'
import type { PortInfo } from '../core/backend'
import { emptyPatch, type Patch } from '../core/patch'
import { Matrix } from './Matrix'

function PortList({ title, ports }: { title: string; ports: PortInfo[] }) {
  return (
    <section>
      <h2>{title}</h2>
      {ports.length === 0 ? (
        <p>No devices connected</p>
      ) : (
        <ul>
          {ports.map((p) => (
            <li key={p.id}>
              {p.id} | {p.name} | {p.manufacturer || '(empty)'} | v{p.version} |{' '}
              {p.state} | {p.connection}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function App() {
  const devices = useSyncExternalStore(backend.subscribe, backend.getSnapshot)
  const [patch, setPatch] = useState<Patch>(emptyPatch)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    backend.start()
    store.load().then((saved) => {
      if (saved) setPatch(saved)
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    // Wait for the saved patch, otherwise the empty initial patch would overwrite it.
    if (!loaded) return
    router.setPatch(patch)
    store.save(patch)
  }, [patch, loaded])

  if (!backend.supported) return <p>Web MIDI is not supported in this browser</p>
  if (devices.error) return <p>{devices.error}</p>

  return (
    <>
      <h1>MIDI devices</h1>
      <PortList title="Inputs" ports={devices.inputs} />
      <PortList title="Outputs" ports={devices.outputs} />
      <Matrix patch={patch} setPatch={setPatch} devices={devices} />
    </>
  )
}

export default App
