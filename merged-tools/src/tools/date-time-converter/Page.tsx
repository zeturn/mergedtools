import { useEffect, useMemo, useState } from 'react'

type Mode = 'unix-seconds' | 'unix-millis' | 'iso' | 'local-components'

function pad(n:number){ return String(n).padStart(2,'0') }

function parseInput(mode: Mode, value: string): number | null {
  try{
    if (mode === 'unix-seconds') {
      const s = parseFloat(value)
      if (Number.isNaN(s)) return null
      return s * 1000
    }
    if (mode === 'unix-millis') {
      const ms = parseFloat(value)
      if (Number.isNaN(ms)) return null
      return ms
    }
    if (mode === 'iso') {
      const d = new Date(value)
      return Number.isNaN(d.getTime()) ? null : d.getTime()
    }
    if (mode === 'local-components') {
      // value format: YYYY-MM-DD HH:mm:ss
      const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/)
      if (!m) return null
  const [, Y, M, D, h, m2, s] = m
      const d = new Date()
      d.setFullYear(parseInt(Y,10))
      d.setMonth(parseInt(M,10)-1)
      d.setDate(parseInt(D,10))
      d.setHours(parseInt(h,10), parseInt(m2,10), parseInt(s,10), 0)
      return d.getTime()
    }
    return null
  }catch{
    return null
  }
}

function formatAll(ms: number){
  const d = new Date(ms)
  const local = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  const iso = d.toISOString()
  const unixSeconds = Math.floor(ms/1000)
  const unixMillis = ms
  return { local, iso, unixSeconds, unixMillis }
}

export default function Page(){
  const [mode, setMode] = useState<Mode>('unix-seconds')
  const [value, setValue] = useState('1728888888')
  const [nowMs, setNowMs] = useState(Date.now())
  const parsed = useMemo(()=> parseInput(mode, value), [mode, value])
  const ms = parsed ?? nowMs
  const out = useMemo(()=> formatAll(ms), [ms])

  // 自动更新时间（仅当输入无效时）
  useEffect(()=>{
    if (parsed !== null) return
    const t = setInterval(()=> setNowMs(Date.now()), 1000)
    return ()=> clearInterval(t)
  }, [parsed])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-2 items-center">
        <select className="input" value={mode} onChange={e=>setMode(e.target.value as Mode)}>
          <option value="unix-seconds">输入：Unix 秒</option>
          <option value="unix-millis">输入：Unix 毫秒</option>
          <option value="iso">输入：ISO 字符串</option>
          <option value="local-components">输入：本地组件(YYYY-MM-DD HH:mm:ss)</option>
        </select>
        <input className="input" value={value} onChange={e=>setValue(e.target.value)} />
        <button className="btn" onClick={()=>{ setValue(String(Math.floor(Date.now()/1000))); setMode('unix-seconds') }}>使用当前时间</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">
          <div className="text-xs text-gray-500">本地时间</div>
          <div className="font-mono break-all">{out.local}</div>
        </div>
        <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">
          <div className="text-xs text-gray-500">ISO (UTC)</div>
          <div className="font-mono break-all">{out.iso}</div>
        </div>
        <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">
          <div className="text-xs text-gray-500">Unix 秒</div>
          <div className="font-mono break-all">{out.unixSeconds}</div>
        </div>
        <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">
          <div className="text-xs text-gray-500">Unix 毫秒</div>
          <div className="font-mono break-all">{out.unixMillis}</div>
        </div>
      </div>
    </div>
  )
}
