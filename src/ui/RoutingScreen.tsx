import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Devices } from '../core/backend'
import { activeScene, type Patch } from '../core/patch'
import { addScene, selectScene } from '../core/patchOps'
import { Matrix } from './Matrix'

type View = 'matrix' | 'graph'

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  devices: Devices
}

export function RoutingScreen({ patch, setPatch, devices }: Props) {
  const [view, setView] = useState<View>('matrix')

  return (
    <div className="flex items-start gap-8">
      <nav className="flex w-[200px] shrink-0 flex-col gap-1">
        <h2 className="mb-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Scenes
        </h2>
        {patch.scenes.map((scene) => (
          <Button
            key={scene.id}
            // The default variant is the bright fill with dark text: the active scene.
            variant={scene.id === patch.activeScene ? 'default' : 'ghost'}
            className="justify-start"
            onClick={() => setPatch(selectScene(patch, scene.id))}
          >
            {scene.name}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setPatch(addScene(patch))}
        >
          <Plus />
          Add scene
        </Button>
      </nav>
      <div className="min-w-0 flex-1 overflow-x-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{activeScene(patch).name}</h2>
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList>
              <TabsTrigger value="matrix">Matrix</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {view === 'matrix' ? (
          <Matrix patch={patch} setPatch={setPatch} devices={devices} />
        ) : (
          <p className="text-muted-foreground">graph here</p>
        )}
      </div>
    </div>
  )
}
