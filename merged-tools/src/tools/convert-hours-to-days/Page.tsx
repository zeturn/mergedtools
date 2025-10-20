import { useMemo, useState } from 'react'

export default function Page(){
  const [hours, setHours] = useState('36')
  const out = useMemo(()=>{
    const h = parseFloat(hours)
    if (Number.isNaN(h)) return '请输入数字'
    const days = h / 24
    const minutes = h * 60
    const seconds = minutes * 60
    return `${h} 小时 = ${days} 天 = ${minutes} 分钟 = ${seconds} 秒`
  }, [hours])
  return (
    <div className="space-y-3">
      <input className="input" value={hours} onChange={e=>setHours(e.target.value)} />
      <div className="rounded border p-3 bg-gray-50 dark:bg-gray-900/40">{out}</div>
    </div>
  )
}
