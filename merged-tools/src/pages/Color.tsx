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
    <div className="space-y-8">
      {/* Page title */}
      <div className="border-b border-slate-700/50 pb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">颜色转换</h1>
        <p className="text-slate-400 mt-2">在 HEX 和 RGB 颜色格式之间转换</p>
      </div>

      {/* HEX to RGB */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
          <h2 className="text-xl font-semibold text-slate-100">HEX → RGB</h2>
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">HEX 颜色值</label>
          <div className="flex gap-3">
            <input 
              className="flex-1 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 p-3 font-mono transition-all outline-none" 
              value={hex} 
              onChange={(e) => setHex(e.target.value)}
              placeholder="#3366ff" 
            />
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-16 h-12 rounded-lg border border-slate-700 cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Red</div>
              <div className="text-2xl font-bold text-red-400">{rgb.r}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Green</div>
              <div className="text-2xl font-bold text-green-400">{rgb.g}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Blue</div>
              <div className="text-2xl font-bold text-blue-400">{rgb.b}</div>
            </div>
          </div>
          <div className="h-20 rounded-lg shadow-lg border-2 border-slate-700" style={{ backgroundColor: hex }} />
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-800/80 px-4 text-slate-500 text-sm">⇅</span>
        </div>
      </div>

      {/* RGB to HEX */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
          <h2 className="text-xl font-semibold text-slate-100">RGB → HEX</h2>
        </div>
        <div className="space-y-3">
          <label className="block text-sm text-slate-400">RGB 值 (0-255)</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="block text-xs text-red-400">R</label>
              <input 
                type="number" 
                className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 p-3 transition-all outline-none" 
                value={r} 
                min={0} 
                max={255} 
                onChange={(e) => setR(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-green-400">G</label>
              <input 
                type="number" 
                className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 p-3 transition-all outline-none" 
                value={g} 
                min={0} 
                max={255} 
                onChange={(e) => setG(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs text-blue-400">B</label>
              <input 
                type="number" 
                className="w-full rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 transition-all outline-none" 
                value={b} 
                min={0} 
                max={255} 
                onChange={(e) => setB(Number(e.target.value))} 
              />
            </div>
          </div>
          <div className="rounded-lg bg-slate-900/50 border border-slate-700 p-4 font-mono text-2xl text-center text-purple-300">
            {hex2}
          </div>
          <div className="h-20 rounded-lg shadow-lg border-2 border-slate-700" style={{ backgroundColor: hex2 }} />
        </div>
      </section>
    </div>
  )
}
