import { useMemo, useState } from 'react'
import Input from '../../components/Input'

function toHMS(total: number){
  const sign = total < 0 ? '-' : ''
  total = Math.abs(total)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600)/60)
  const s = Math.floor(total % 60)
  const pad = (n:number)=> String(n).padStart(2,'0')
  return `${sign}${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function Page(){
  const [sec, setSec] = useState('3661')
  const out = useMemo(()=>{
    const n = parseFloat(sec)
    if (Number.isNaN(n)) return '请输入数字（秒）'
    return toHMS(n)
  }, [sec])
  return (
    <div className="space-y-3">
      <Input  variant="simple" value={sec} onChange={e=>setSec(e.target.value)} />
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40 font-mono">{out}</div>
    </div>
  )
}
