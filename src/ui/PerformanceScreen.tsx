import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { activeScene, type Patch } from '../core/patch'
import { selectScene } from '../core/patchOps'
import { Led } from './Led'
import { useRouterActivity } from './useRouterActivity'

type Props = {
  patch: Patch
  setPatch: (patch: Patch) => void
  onOpenRouting: () => void
}

const routeCount = (n: number) => `${n} ${n === 1 ? 'route' : 'routes'}`

export function PerformanceScreen({ patch, setPatch, onOpenRouting }: Props) {
  const { stats, flowing } = useRouterActivity()
  const labels = new Map(patch.endpoints.map((e) => [e.id, e.label]))
  const routes = activeScene(patch).edges.filter((e) => e.enabled)

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {patch.scenes.map((scene) => {
          const active = scene.id === patch.activeScene
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => setPatch(selectScene(patch, scene.id))}
              className={cn(
                'flex h-[110px] cursor-pointer flex-col justify-between rounded-md border p-5 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                // Active = bright, inactive = dark. Text colors are explicit so they stay readable on the fill.
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-accent/50',
              )}
            >
              <span className="text-lg font-semibold">{scene.name}</span>
              <span className={cn('text-sm', active ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
                {routeCount(scene.edges.filter((e) => e.enabled).length)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Live</h2>
        {routes.length === 0 ? (
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">This scene has no routes yet.</p>
            <Button variant="outline" size="sm" onClick={onOpenRouting}>
              Open Routing
            </Button>
          </div>
        ) : (
          routes.map((edge) => {
            const stat = stats.find((s) => s.id === edge.id)
            const from = labels.get(edge.from) ?? edge.from
            const to = labels.get(edge.to) ?? edge.to
            return (
              <div key={edge.id} className="flex items-center justify-between rounded-md border px-4 py-2.5">
                <div className="flex items-center gap-4">
                  <Led lit={flowing.has(edge.id)} label={from} size={12} />
                  <span>
                    {from} → {to}
                  </span>
                </div>
                <span className={cn('font-mono', !stat?.active && 'text-muted-foreground')}>
                  {stat?.active ? stat.count : 'offline'}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
