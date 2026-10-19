import { Tooltip } from '@mantine/core'

type Props = { lit: boolean; label: string; size?: number }

// Bright with a soft glow while lit, otherwise a dim dot.
export function Led({ lit, label, size = 10 }: Props) {
  return (
    <Tooltip label={label}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: lit ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-dark-3)',
          boxShadow: lit ? '0 0 8px 1px rgba(255, 255, 255, 0.6)' : 'none',
          transition: 'background 120ms, box-shadow 120ms',
        }}
      />
    </Tooltip>
  )
}
