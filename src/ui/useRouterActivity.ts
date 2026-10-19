import { useEffect, useState } from 'react'
import { router } from '../composition'
import type { EdgeStat } from '../core/router'

// Polls router.stats() a few times per second. `flowing` holds the edges whose counter moved since the last poll.
export function useRouterActivity() {
  const [state, setState] = useState<{ stats: EdgeStat[]; flowing: ReadonlySet<string> }>({
    stats: [],
    flowing: new Set(),
  })

  useEffect(() => {
    let previous = new Map<string, number>()
    const t = setInterval(() => {
      const stats = router.stats()
      const flowing = new Set(
        stats.filter((s) => s.count > (previous.get(s.id) ?? s.count)).map((s) => s.id),
      )
      previous = new Map(stats.map((s) => [s.id, s.count]))
      setState({ stats, flowing })
    }, 250)
    return () => clearInterval(t)
  }, [])

  return state
}
