import { useMemo, useState } from 'react'

function fmt(ms: number) {
  const abs = Math.abs(ms)
  const s = Math.floor(abs / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${d}天 ${h}小时 ${m}分 ${sec}秒`
}

export default function Page() {
  const nowIso = new Date().toISOString().slice(0,16)
  const [a, setA] = useState(nowIso)
  const [b, setB] = useState(nowIso)
  const diff = useMemo(() => {
    const ta = new Date(a)
    const tb = new Date(b)
    if (isNaN(ta.getTime()) || isNaN(tb.getTime())) return null
    const ms = tb.getTime() - ta.getTime()
    return { ms, human: fmt(ms) }
  }, [a, b])
  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap items-center">
        <label className="text-sm text-slate-400">起</label>
        <input type="datetime-local" className="rounded bg-slate-800 p-2" value={a} onChange={(e)=>setA(e.target.value)} />
        <label className="text-sm text-slate-400">止</label>
        <input type="datetime-local" className="rounded bg-slate-800 p-2" value={b} onChange={(e)=>setB(e.target.value)} />
      </div>
      {diff ? (
        <div className="space-y-1">
          <div className="text-sm text-slate-400">毫秒差</div>
          <div className="rounded bg-slate-900 p-2 font-mono">{diff.ms}</div>
          <div className="text-sm text-slate-400">友好显示</div>
          <div className="rounded bg-slate-900 p-2 font-mono">{diff.human}</div>
        </div>
      ) : <div className="text-red-400">时间格式无效</div>}
    </div>
  )
}
