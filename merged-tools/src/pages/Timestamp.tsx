import { useEffect, useMemo, useState } from 'react'

function toDate(input: string) {
  const n = Number(input)
  if (Number.isFinite(n)) {
    // Detect seconds vs milliseconds
    const ms = n < 1e12 ? n * 1000 : n
    return new Date(ms)
  }
  const d = new Date(input)
  return Number.isNaN(d.getTime()) ? null : d
}

export default function TimestampPage() {
  const [raw, setRaw] = useState(() => Math.floor(Date.now() / 1000).toString())
  const d = useMemo(() => toDate(raw), [raw])
  const [isoNow, setIsoNow] = useState('')
  useEffect(() => setIsoNow(new Date().toISOString()), [])

  return (
    <div className="space-y-4">
      <input className="w-full rounded bg-slate-800 p-2" value={raw} onChange={(e) => setRaw(e.target.value)} />
      {d ? (
        <div className="space-y-1 text-slate-300">
          <div>ISO: <span className="font-mono">{d.toISOString()}</span></div>
          <div>本地: <span className="font-mono">{d.toString()}</span></div>
          <div>毫秒: <span className="font-mono">{d.getTime()}</span></div>
          <div>秒: <span className="font-mono">{Math.floor(d.getTime() / 1000)}</span></div>
        </div>
      ) : (
        <div className="text-red-400">无法解析此时间/时间戳</div>
      )}
      <div className="text-xs text-slate-500">现在: {isoNow}</div>
    </div>
  )
}
