import { useEffect, useMemo, useState } from 'react'

type RGB = { r: number, g: number, b: number }
type HSL = { h: number, s: number, l: number }

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)) }

function hexToRgb(hex: string): RGB | null {
  const m = hex.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(m)) {
    const r = parseInt(m[0] + m[0], 16)
    const g = parseInt(m[1] + m[1], 16)
    const b = parseInt(m[2] + m[2], 16)
    return { r, g, b }
  }
  if (/^[0-9a-fA-F]{6}$/.test(m)) {
    const r = parseInt(m.slice(0, 2), 16)
    const g = parseInt(m.slice(2, 4), 16)
    const b = parseInt(m.slice(4, 6), 16)
    return { r, g, b }
  }
  return null
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(x => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join('')
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break
      case g1: h = (b1 - r1) / d + 2; break
      case b1: h = (r1 - g1) / d + 4; break
    }
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const h1 = ((h % 360) + 360) % 360 / 360
  const s1 = clamp(s, 0, 100) / 100
  const l1 = clamp(l, 0, 100) / 100
  if (s1 === 0) {
    const v = Math.round(l1 * 255)
    return { r: v, g: v, b: v }
  }
  const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1
  const p = 2 * l1 - q
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const r = Math.round(hue2rgb(h1 + 1 / 3) * 255)
  const g = Math.round(hue2rgb(h1) * 255)
  const b = Math.round(hue2rgb(h1 - 1 / 3) * 255)
  return { r, g, b }
}

export default function Page() {
  const [hex, setHex] = useState('#409EFF')
  const [rgb, setRgb] = useState<RGB>({ r: 64, g: 158, b: 255 })
  const [hsl, setHsl] = useState<HSL>(() => rgbToHsl(rgb))

  // keep in sync: when any changes, compute the other two
  useEffect(() => {
    const r = hexToRgb(hex)
    if (r) {
      setRgb(r)
      setHsl(rgbToHsl(r))
    }
  }, [hex])

  useEffect(() => {
    setHex(rgbToHex(rgb))
    setHsl(rgbToHsl(rgb))
  }, [rgb.r, rgb.g, rgb.b])

  useEffect(() => {
    setRgb(hslToRgb(hsl))
    setHex(rgbToHex(hslToRgb(hsl)))
  }, [hsl.h, hsl.s, hsl.l])

  const preview = useMemo(() => ({ backgroundColor: hex }), [hex])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-3">
        <h3 className="text-lg font-semibold">HEX</h3>
        <input className="w-full rounded bg-slate-800 p-2 font-mono" value={hex} onChange={(e)=>setHex(e.target.value)} />

        <h3 className="text-lg font-semibold">RGB</h3>
        <div className="flex gap-2">
          <input type="number" className="w-24 rounded bg-slate-800 p-2" value={rgb.r} min={0} max={255} onChange={(e)=>setRgb(v=>({ ...v, r: Number(e.target.value) }))} />
          <input type="number" className="w-24 rounded bg-slate-800 p-2" value={rgb.g} min={0} max={255} onChange={(e)=>setRgb(v=>({ ...v, g: Number(e.target.value) }))} />
          <input type="number" className="w-24 rounded bg-slate-800 p-2" value={rgb.b} min={0} max={255} onChange={(e)=>setRgb(v=>({ ...v, b: Number(e.target.value) }))} />
        </div>

        <h3 className="text-lg font-semibold">HSL</h3>
        <div className="flex gap-2">
          <input type="number" className="w-24 rounded bg-slate-800 p-2" value={hsl.h} min={0} max={360} onChange={(e)=>setHsl(v=>({ ...v, h: Number(e.target.value) }))} />
          <input type="number" className="w-24 rounded bg-slate-800 p-2" value={hsl.s} min={0} max={100} onChange={(e)=>setHsl(v=>({ ...v, s: Number(e.target.value) }))} />
          <input type="number" className="w-24 rounded bg-slate-800 p-2" value={hsl.l} min={0} max={100} onChange={(e)=>setHsl(v=>({ ...v, l: Number(e.target.value) }))} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="h-40 rounded border border-slate-700" style={preview} />
        <div className="space-y-1 text-sm text-slate-300">
          <div>HEX: <span className="font-mono">{hex}</span></div>
          <div>RGB: <span className="font-mono">{rgb.r}, {rgb.g}, {rgb.b}</span></div>
          <div>HSL: <span className="font-mono">{hsl.h}°, {hsl.s}%, {hsl.l}%</span></div>
        </div>
      </section>
    </div>
  )
}
