import { useMemo, useState } from 'react'

export default function Page(){
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(5)
  const [unique, setUnique] = useState(false)
  const [fractionDigits, setFractionDigits] = useState(0)

  const nums = useMemo(()=>{
    const lo = Math.min(min, max)
    const hi = Math.max(min, max)
    const n = Math.max(0, Math.min(1000, count))
    const out: number[] = []
    if (unique) {
      const set = new Set<number>()
      while (set.size < n && set.size < 100000) {
        const v = rand(lo, hi, fractionDigits)
        set.add(Number(v.toFixed(fractionDigits)))
      }
      out.push(...Array.from(set))
    } else {
      for (let i=0; i<n; i++) out.push(rand(lo, hi, fractionDigits))
    }
    return out.map(v => Number(v.toFixed(fractionDigits)))
  }, [min, max, count, unique, fractionDigits])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">随机数生成</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <L label="最小值"><input type="number" className="input" value={min} onChange={e=>setMin(Number(e.target.value))} /></L>
        <L label="最大值"><input type="number" className="input" value={max} onChange={e=>setMax(Number(e.target.value))} /></L>
        <L label="数量"><input type="number" className="input" value={count} onChange={e=>setCount(Number(e.target.value))} /></L>
        <L label="小数位"><input type="number" className="input" value={fractionDigits} onChange={e=>setFractionDigits(Math.max(0, Math.min(10, Number(e.target.value))))} /></L>
        <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={unique} onChange={e=>setUnique(e.target.checked)} /> 去重</label>
      </div>
      <div className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">
        {nums.join(', ')}
      </div>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }){
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function rand(min: number, max: number, fd: number){
  const v = Math.random() * (max - min) + min
  if (fd <= 0) return Math.floor(v)
  return v
}
