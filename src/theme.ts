import { createTheme, type MantineColorsTuple } from '@mantine/core'

// Monochrome: brightness is the only indicator for now (active, lit, on).
const mono: MantineColorsTuple = [
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
  '#141617',
]

// Mantine's default dark-2 (dimmed text) and dark-3 are too low-contrast on the dark background:
// dark-2 is for dimmed text (about 5.5:1), dark-3 for non-text markers like idle LEDs and outlines (about 3.6:1).
const dark: MantineColorsTuple = [
  '#C9C9C9',
  '#b8b8b8',
  '#9a9a9a',
  '#7a7a7a',
  '#424242',
  '#3b3b3b',
  '#2e2e2e',
  '#242424',
  '#1f1f1f',
  '#141414',
]

export const theme = createTheme({
  colors: { mono, dark },
  primaryColor: 'mono',
  primaryShade: { light: 8, dark: 2 },
  autoContrast: true,
  defaultRadius: 'sm',
  fontFamilyMonospace: 'ui-monospace, "Cascadia Code", Consolas, monospace',
  headings: { fontWeight: '600' },
})
