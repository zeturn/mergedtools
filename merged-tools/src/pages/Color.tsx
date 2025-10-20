import { useEffect, useMemo, useState } from 'react'
import { hexToRgb, rgbToHex } from '../tools/color'

export default function ColorPage() {
  const [hex, setHex] = useState('#3366ff')
  const [r, setR] = useState(51)
  const [g, setG] = useState(102)
  const [b, setB] = useState(255)

  const rgb = useMemo(() => hexToRgb(hex) ?? { r: 0, g: 0, b: 0 }, [hex])
  useEffect(() => {
    setR(rgb.r); setG(rgb.g); setB(rgb.b)
  }, [rgb.r, rgb.g, rgb.b])

  const hex2 = useMemo(() => rgbToHex(r, g, b) ?? '#000000', [r, g, b])

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">HEX → RGB</h2>
        <input className="w-full rounded bg-slate-800 p-2 font-mono" value={hex} onChange={(e) => setHex(e.target.value)} />
        <div className="flex gap-4 text-slate-300"><span>R: {rgb.r}</span><span>G: {rgb.g}</span><span>B: {rgb.b}</span></div>
        <div className="h-12 rounded" style={{ backgroundColor: hex }} />
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">RGB → HEX</h2>
        <div className="grid grid-cols-3 gap-3">
          <input type="number" className="rounded bg-slate-800 p-2" value={r} min={0} max={255} onChange={(e) => setR(Number(e.target.value))} />
          <input type="number" className="rounded bg-slate-800 p-2" value={g} min={0} max={255} onChange={(e) => setG(Number(e.target.value))} />
          <input type="number" className="rounded bg-slate-800 p-2" value={b} min={0} max={255} onChange={(e) => setB(Number(e.target.value))} />
        </div>
        <div className="font-mono">{hex2}</div>
        <div className="h-12 rounded" style={{ backgroundColor: hex2 }} />
      </section>
    </div>
  )
}
