import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type Props = { lit: boolean; label: string; size?: number }

// Bright with a soft glow while lit, otherwise a dim dot.
export function Led({ lit, label, size = 10 }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'shrink-0 rounded-full transition-[background-color,box-shadow] duration-120',
            lit ? 'bg-foreground shadow-[0_0_8px_1px_rgba(255,255,255,0.6)]' : 'bg-marker',
          )}
          style={{ width: size, height: size }}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
