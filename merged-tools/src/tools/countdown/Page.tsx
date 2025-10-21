import { useEffect, useMemo, useState } from 'react'
import Input from '../../components/Input'

function pad(n: number, w = 2) { return n.toString().padStart(w, '0') }

function toLocalDatetimeValue(d: Date) {
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${y}-${m}-${day}T${hh}:${mm}`
}

export default function Page() {
  const now = new Date()
  const [target, setTarget] = useState(() => {
    const url = new URL(location.href)
    const t = url.searchParams.get('t')
    if (t) {
      const ms = Number(t)
      if (Number.isFinite(ms)) return toLocalDatetimeValue(new Date(ms))
    }
    return toLocalDatetimeValue(new Date(now.getTime() + 3600_000))
  })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const left = useMemo(() => {
    const targetDate = new Date(target)
    const diff = Math.max(0, targetDate.getTime() - Date.now())
    const totalSeconds = Math.floor(diff / 1000)
    const d = Math.floor(totalSeconds / 86400)
    const h = Math.floor((totalSeconds % 86400) / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return { d, h, m, s, diff }
  }, [target, tick])

  const share = () => {
    const ms = new Date(target).getTime()
    const url = new URL(location.href)
    url.searchParams.set('t', String(ms))
    navigator.clipboard.writeText(url.toString())
    alert('已复制分享链接')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input  variant="simple" type="datetime-local" value={target} onChange={(e)=>setTarget(e.target.value)} />
        <button className="btn" onClick={share}>复制分享链接</button>
      </div>
      <div className="text-4xl font-mono">
        {left.d}天 {pad(left.h)}:{pad(left.m)}:{pad(left.s)}
      </div>
      {left.diff === 0 && <div className="text-green-600">时间到！</div>}
    </div>
  )
}
