import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function parseHMS(s: string){
  const m = s.trim().match(/^(-)?(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\.(\d+))?$/)
  if(!m) throw new Error('格式应为 HH:MM:SS')
  const neg = !!m[1]
  const h = parseInt(m[2],10), mm = parseInt(m[3],10), ss = parseInt(m[4],10)
  if(mm>=60 || ss>=60) throw new Error('分钟与秒应 < 60')
  let total = h*3600 + mm*60 + ss
  return neg ? -total : total
}

export default function Page(){
  const [time, setTime] = useState('01:01:01')
  const out = useMemo(()=>{
    try { return String(parseHMS(time)) } catch(e:any){ return e.message || String(e) }
  }, [time])
  return (
    <div className="space-y-3">
      <Input  variant="simple" value={time} onChange={e=>setTime(e.target.value)} />
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40 font-mono">{out}</div>
    </div>
  )
}
