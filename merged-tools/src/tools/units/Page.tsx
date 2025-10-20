import { useMemo, useState } from 'react'

type Cat = 'length' | 'mass' | 'temp'

const lengthUnits = ['m','km','ft','mi'] as const
const massUnits = ['g','kg','lb'] as const

function convLength(value: number, from: typeof lengthUnits[number], to: typeof lengthUnits[number]) {
  const toM = { m: 1, km: 1000, ft: 0.3048, mi: 1609.344 }[from]
  const vM = value * toM
  const fromM = { m: 1, km: 1/1000, ft: 1/0.3048, mi: 1/1609.344 }[to]
  return vM * fromM
}
function convMass(value: number, from: typeof massUnits[number], to: typeof massUnits[number]) {
  const toG = { g: 1, kg: 1000, lb: 453.59237 }[from]
  const vG = value * toG
  const fromG = { g: 1, kg: 1/1000, lb: 1/453.59237 }[to]
  return vG * fromG
}
function convTemp(value: number, from: 'C'|'F'|'K', to: 'C'|'F'|'K') {
  let c: number
  if (from === 'C') c = value
  else if (from === 'F') c = (value - 32) * 5/9
  else c = value - 273.15
  if (to === 'C') return c
  if (to === 'F') return c * 9/5 + 32
  return c + 273.15
}

export default function Page() {
  const [cat, setCat] = useState<Cat>('length')
  const [value, setValue] = useState(1)
  const [fromL, setFromL] = useState<typeof lengthUnits[number]>('m')
  const [toL, setToL] = useState<typeof lengthUnits[number]>('km')
  const [fromM, setFromM] = useState<typeof massUnits[number]>('g')
  const [toM, setToM] = useState<typeof massUnits[number]>('kg')
  const [fromT, setFromT] = useState<'C'|'F'|'K'>('C')
  const [toT, setToT] = useState<'C'|'F'|'K'>('F')

  const result = useMemo(() => {
    if (!Number.isFinite(value)) return ''
    if (cat === 'length') return convLength(value, fromL, toL).toString()
    if (cat === 'mass') return convMass(value, fromM, toM).toString()
    return convTemp(value, fromT, toT).toString()
  }, [cat, value, fromL, toL, fromM, toM, fromT, toT])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${cat==='length'?'bg-slate-700':'bg-slate-800 hover:bg-slate-700'}`} onClick={() => setCat('length')}>长度</button>
        <button className={`px-3 py-1 rounded ${cat==='mass'?'bg-slate-700':'bg-slate-800 hover:bg-slate-700'}`} onClick={() => setCat('mass')}>质量</button>
        <button className={`px-3 py-1 rounded ${cat==='temp'?'bg-slate-700':'bg-slate-800 hover:bg-slate-700'}`} onClick={() => setCat('temp')}>温度</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3 items-center">
        <input type="number" className="rounded bg-slate-800 p-2" value={value} onChange={(e) => setValue(Number(e.target.value))} />
        {cat==='length' && (
          <>
            <select className="rounded bg-slate-800 p-2" value={fromL} onChange={(e)=>setFromL(e.target.value as any)}>{lengthUnits.map(u=><option key={u}>{u}</option>)}</select>
            <div className="text-center">→</div>
            <select className="rounded bg-slate-800 p-2" value={toL} onChange={(e)=>setToL(e.target.value as any)}>{lengthUnits.map(u=><option key={u}>{u}</option>)}</select>
          </>
        )}
        {cat==='mass' && (
          <>
            <select className="rounded bg-slate-800 p-2" value={fromM} onChange={(e)=>setFromM(e.target.value as any)}>{massUnits.map(u=><option key={u}>{u}</option>)}</select>
            <div className="text-center">→</div>
            <select className="rounded bg-slate-800 p-2" value={toM} onChange={(e)=>setToM(e.target.value as any)}>{massUnits.map(u=><option key={u}>{u}</option>)}</select>
          </>
        )}
        {cat==='temp' && (
          <>
            <select className="rounded bg-slate-800 p-2" value={fromT} onChange={(e)=>setFromT(e.target.value as any)}>{['C','F','K'].map(u=><option key={u}>{u}</option>)}</select>
            <div className="text-center">→</div>
            <select className="rounded bg-slate-800 p-2" value={toT} onChange={(e)=>setToT(e.target.value as any)}>{['C','F','K'].map(u=><option key={u}>{u}</option>)}</select>
          </>
        )}
      </div>
      <div className="rounded bg-slate-800 p-2 font-mono">{result}</div>
    </div>
  )
}
