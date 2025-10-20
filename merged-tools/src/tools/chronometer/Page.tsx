import { useEffect, useRef, useState } from 'react'

function fmt(ms: number) {
  const t = Math.max(0, Math.floor(ms))
  const s = Math.floor(t / 1000)
  const msec = t % 1000
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number, w = 2) => n.toString().padStart(w, '0')
  return `${pad(h)}:${pad(m)}:${pad(sec)}.${pad(msec, 3)}`
}

export default function Page() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const startRef = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    const start = performance.now() - elapsed
    startRef.current = start
    const tick = () => {
      setElapsed(performance.now() - (startRef.current ?? performance.now()))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [running])

  const onStartStop = () => setRunning((v) => !v)
  const onReset = () => { setRunning(false); setElapsed(0); setLaps([]); startRef.current = null; if (raf.current) cancelAnimationFrame(raf.current) }
  const onLap = () => { setLaps((xs) => [elapsed, ...xs]) }
  const onCopy = async () => {
    const lines = ['Total\t' + fmt(elapsed), ...laps.map((ms, i) => `Lap ${laps.length - i}\t${fmt(ms)}`)]
    await navigator.clipboard.writeText(lines.join('\n'))
    alert('已复制')
  }

  return (
    <div className="space-y-4">
      <div className="text-4xl font-mono">{fmt(elapsed)}</div>
      <div className="flex gap-2">
        <button className="btn" onClick={onStartStop}>{running ? '暂停' : '开始'}</button>
        <button className="btn" onClick={onLap} disabled={!running}>圈速</button>
        <button className="btn" onClick={onReset}>清零</button>
        <button className="btn" onClick={onCopy} disabled={laps.length === 0 && elapsed === 0}>复制</button>
      </div>
      {laps.length > 0 && (
        <div className="mt-2">
          <div className="text-sm text-gray-500 mb-1">圈速（最新在前）</div>
          <div className="max-h-64 overflow-auto border rounded">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                <tr><th className="text-left p-2">#</th><th className="text-left p-2">耗时</th></tr>
              </thead>
              <tbody>
                {laps.map((ms, i) => (
                  <tr key={i} className="odd:bg-gray-50 dark:odd:bg-gray-900/40">
                    <td className="p-2">{laps.length - i}</td>
                    <td className="p-2 font-mono">{fmt(ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
