import { useMemo, useState } from 'react'
import cronParser from 'cron-parser'

export default function Page() {
  const [expr, setExpr] = useState('*/5 * * * *')
  const [count, setCount] = useState(5)
  const [tz, setTz] = useState('')
  const out = useMemo(() => {
    try {
  const options: any = { iterator: true }
      if (tz.trim()) options.tz = tz.trim()
  const interval = (cronParser as any).parseExpression(expr, options)
      const arr: string[] = []
      for (let i = 0; i < Math.max(1, Math.min(50, count)); i++) {
        const n = interval.next()
        arr.push(n.value.toString())
      }
      return arr
    } catch (e: any) {
      return [`错误: ${e?.message ?? '无'}`]
    }
  }, [expr, count, tz])

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-3 items-center">
        <input className="rounded bg-slate-800 p-2" value={expr} onChange={(e)=>setExpr(e.target.value)} placeholder="Cron 表达式，如 */5 * * * *" />
        <input type="number" className="rounded bg-slate-800 p-2" value={count} onChange={(e)=>setCount(Number(e.target.value))} min={1} max={50} />
        <input className="rounded bg-slate-800 p-2" value={tz} onChange={(e)=>setTz(e.target.value)} placeholder="时区（可选），例如 Asia/Shanghai" />
      </div>
      <ul className="list-disc pl-6 space-y-1">
        {out.map((x, i) => <li key={i} className="font-mono">{x}</li>)}
      </ul>
    </div>
  )
}
