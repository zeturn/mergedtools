import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function toDateString(ts: number){
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '无效时间'
  const pad=(n:number)=> String(n).padStart(2,'0')
  const iso = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  return `${iso} (本地)\n${d.toISOString()} (UTC)`
}

export default function Page(){
  const [ts, setTs] = useState('1728888888')
  const [unit, setUnit] = useState<'auto'|'seconds'|'milliseconds'>('auto')
  const out = useMemo(()=>{
    const n = parseFloat(ts)
    if (Number.isNaN(n)) return '请输入数字时间戳'
    let ms = n
    if (unit==='auto'){
      // 简单自动判断：小于 10^11 视为秒
      ms = n < 1e11 ? n*1000 : n
    } else if (unit==='seconds') {
      ms = n*1000
    }
    return toDateString(ms)
  }, [ts, unit])
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" value={ts} onChange={e=>setTs(e.target.value)} />
        <select className="input" value={unit} onChange={e=>setUnit(e.target.value as any)}>
          <option value="auto">自动判断</option>
          <option value="seconds">秒</option>
          <option value="milliseconds">毫秒</option>
        </select>
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
