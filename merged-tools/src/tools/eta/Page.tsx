import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function fmtDuration(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '-'
  const d = Math.floor(sec / 86400)
  sec %= 86400
  const h = Math.floor(sec / 3600)
  sec %= 3600
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  const parts = [] as string[]
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

export default function Page() {
  const [total, setTotal] = useState('1000')
  const [done, setDone] = useState('420')
  const [rate, setRate] = useState('3.5') // 单位/秒
  const [elapsed, setElapsed] = useState('120') // 已用秒

  const val = useMemo(() => {
    const T = Number(total), D = Number(done)
    const R = Number(rate), E = Number(elapsed)
    const remaining = Math.max(0, T - D)
    const r = Number.isFinite(R) && R > 0 ? R : (Number.isFinite(E) && E > 0 && D > 0 ? D / E : NaN)
    const secs = Number.isFinite(r) && r > 0 ? remaining / r : NaN
    const eta = Number.isFinite(secs) ? new Date(Date.now() + secs * 1000) : null
    return { remaining, r, secs, eta }
  }, [total, done, rate, elapsed])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex items-center gap-2"><span className="w-28 text-sm text-gray-500">总量</span><Input  variant="simple" value={total} onChange={(e)=>setTotal(e.target.value)} /></label>
        <label className="flex items-center gap-2"><span className="w-28 text-sm text-gray-500">已完成</span><Input  variant="simple" value={done} onChange={(e)=>setDone(e.target.value)} /></label>
        <label className="flex items-center gap-2"><span className="w-28 text-sm text-gray-500">速率(单位/秒)</span><Input  variant="simple" value={rate} onChange={(e)=>setRate(e.target.value)} /></label>
        <label className="flex items-center gap-2"><span className="w-28 text-sm text-gray-500">已用时间(秒)</span><Input  variant="simple" value={elapsed} onChange={(e)=>setElapsed(e.target.value)} /></label>
      </div>
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40 space-y-1">
        <div>剩余数量：{val.remaining}</div>
        <div>估算速率：{Number.isFinite(val.r) ? val.r.toFixed(3) : '-'}</div>
        <div>预计剩余：{fmtDuration(val.secs)}</div>
        <div>预计完成时间：{val.eta ? val.eta.toLocaleString() : '-'}</div>
      </div>
    </div>
  )
}
