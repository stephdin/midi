// Windows drivers expose extra ports of one device as "MIDIIN2 (Ableton Move MIDI)".
// Strip that wrapper so all ports of a device group under the same name.
export function deviceGroup(portName: string): string {
  return /^MIDI(?:IN|OUT)\d+ \((.*)\)$/.exec(portName)?.[1] ?? portName
}
