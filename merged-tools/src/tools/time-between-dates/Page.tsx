import { useMemo, useState } from 'react'

function diff(a: Date, b: Date){
  const ms = Math.abs(b.getTime() - a.getTime())
  const s = Math.floor(ms/1000)
  const m = Math.floor(s/60)
  const h = Math.floor(m/60)
  const d = Math.floor(h/24)
  return { ms, s, m, h, d }
}

export default function Page(){
  const [start, setStart] = useState('2025-01-01T00:00:00Z')
  const [end, setEnd] = useState('2025-01-02T03:04:05Z')
  const out = useMemo(()=>{
    const a = new Date(start), b = new Date(end)
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return '无效日期'
    const d = diff(a,b)
    return `${d.d} 天 ${d.h%24} 小时 ${d.m%60} 分钟 ${d.s%60} 秒\n(总毫秒: ${d.ms})`
  }, [start, end])
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-2">
        <input className="input" value={start} onChange={e=>setStart(e.target.value)} />
        <input className="input" value={end} onChange={e=>setEnd(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
