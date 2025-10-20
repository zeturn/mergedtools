export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().replace(/^#/, '').toLowerCase()
  const s = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  if (!/^([0-9a-f]{6})$/.test(s)) return null
  const n = parseInt(s, 16)
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff }
}

export function rgbToHex(r: number, g: number, b: number): string | null {
  const ok = (x: number) => Number.isFinite(x) && x >= 0 && x <= 255
  if (!ok(r) || !ok(g) || !ok(b)) return null
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
}
