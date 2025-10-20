import { useMemo, useState } from 'react'

const SI = ['B','kB','MB','GB','TB','PB'] as const
const IEC = ['B','KiB','MiB','GiB','TiB','PiB'] as const

function formatBytes(bytes: number, mode: 'SI'|'IEC'){
  const base = mode==='SI' ? 1000 : 1024
  const units = mode==='SI' ? SI : IEC
  let i = 0
  let v = Math.max(0, bytes)
  while (v >= base && i < units.length - 1){ v /= base; i++ }
  return v.toFixed(2).replace(/\.00$/,'') + ' ' + units[i]
}
function parseSize(input: string): number {
  const m = input.trim().match(/^([0-9]+(?:\.[0-9]+)?)\s*([A-Za-z]*)$/)
  if (!m) return NaN
  const n = parseFloat(m[1])
  const u = m[2].toUpperCase()
  const map: Record<string, number> = {
    'B': 1,
    'K': 1000, 'KB': 1000, 'KIB': 1024,
    'M': 1e6, 'MB': 1e6, 'MIB': 1024**2,
    'G': 1e9, 'GB': 1e9, 'GIB': 1024**3,
    'T': 1e12, 'TB': 1e12, 'TIB': 1024**4,
    'P': 1e15, 'PB': 1e15, 'PIB': 1024**5,
  }
  const mul = map[u || 'B']
  return mul ? Math.round(n * mul) : NaN
}

export default function Page(){
  const [mode, setMode] = useState<'SI'|'IEC'>('SI')
  const [bytes, setBytes] = useState(123456789)
  const [size, setSize] = useState('117.74 MiB')

  const human = useMemo(()=>formatBytes(bytes, mode), [bytes, mode])
  const back = useMemo(()=>parseSize(size), [size])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">Bytes → 人类可读</h3>
        <div className="flex items-center gap-2">
          <input type="number" className="rounded bg-slate-800 p-2 w-48" value={bytes} onChange={(e)=>setBytes(Number(e.target.value)||0)} />
          <select className="rounded bg-slate-800 p-2" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
            <option value="SI">SI（kB）</option>
            <option value="IEC">IEC（KiB）</option>
          </select>
        </div>
        <div className="rounded bg-slate-900 p-2 font-mono">{human}</div>
      </section>
      <section className="space-y-2">
        <h3 className="text-lg font-semibold">人类可读 → Bytes</h3>
        <input className="rounded bg-slate-800 p-2 w-full" value={size} onChange={(e)=>setSize(e.target.value)} />
        <div className="rounded bg-slate-900 p-2 font-mono">{Number.isNaN(back) ? '无效格式' : back.toString()}</div>
      </section>
    </div>
  )
}
