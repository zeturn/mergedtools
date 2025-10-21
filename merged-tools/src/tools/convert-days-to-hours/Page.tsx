import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [days, setDays] = useState('1.5')
  const out = useMemo(()=>{
    const d = parseFloat(days)
    if (Number.isNaN(d)) return '请输入数字'
    const hours = d * 24
    const minutes = hours * 60
    const seconds = minutes * 60
    return `${d} 天 = ${hours} 小时 = ${minutes} 分钟 = ${seconds} 秒`
  }, [days])
  return (
    <div className="space-y-3">
      <Input  variant="simple" value={days} onChange={e=>setDays(e.target.value)} />
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">{out}</div>
    </div>
  )
}
