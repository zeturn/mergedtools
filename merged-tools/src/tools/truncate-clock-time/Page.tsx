import { useMemo, useState } from 'react'

function truncate(dateStr: string, unit: 'hour'|'minute'|'second'){
  const d = new Date(dateStr || Date.now())
  if (Number.isNaN(d.getTime())) return '无效时间'
  if (unit==='hour') { d.setMinutes(0,0,0) }
  if (unit==='minute') { d.setSeconds(0,0) }
  if (unit==='second') { d.setMilliseconds(0) }
  return d.toISOString()
}

export default function Page(){
  const [input, setInput] = useState('2025-01-01T12:34:56.789Z')
  const [unit, setUnit] = useState<'hour'|'minute'|'second'>('minute')
  const out = useMemo(()=> truncate(input, unit), [input, unit])
  return (
    <div className="space-y-3">
      <input className="input" value={input} onChange={e=>setInput(e.target.value)} />
      <select className="input w-full md:w-auto" value={unit} onChange={e=>setUnit(e.target.value as any)}>
        <option value="hour">整点</option>
        <option value="minute">整分</option>
        <option value="second">整秒</option>
      </select>
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40 font-mono break-all">{out}</div>
    </div>
  )
}
