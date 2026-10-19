import { useEffect, useState, useSyncExternalStore } from 'react'
import { Alert } from '@mantine/core'
import { backend, router, store } from '../composition'
import { emptyPatch, type Patch } from '../core/patch'
import { ConfigurationScreen } from './ConfigurationScreen'
import { RoutingScreen } from './RoutingScreen'
import { PerformanceScreen } from './PerformanceScreen'
import { Shell, type Screen } from './Shell'

function App() {
  const devices = useSyncExternalStore(backend.subscribe, backend.getSnapshot)
  const [patch, setPatch] = useState<Patch>(emptyPatch)
  const [loaded, setLoaded] = useState(false)
  const [screen, setScreen] = useState<Screen>('routing')

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

  const error = !backend.supported
    ? 'Web MIDI is not supported in this browser'
    : devices.error

  return (
    <Shell screen={screen} onNavigate={setScreen}>
      {error ? (
        <Alert color="red" title="MIDI unavailable">
          {error}
        </Alert>
      ) : screen === 'configuration' ? (
        <ConfigurationScreen devices={devices} />
      ) : screen === 'routing' ? (
        <RoutingScreen patch={patch} setPatch={setPatch} devices={devices} />
      ) : (
        <PerformanceScreen />
      )}
    </Shell>
  )
}

export default App
