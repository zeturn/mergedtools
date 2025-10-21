import { useMemo, useState } from 'react'
import Input from '../../components/Input'

const zones = ['UTC','Asia/Shanghai','America/New_York','Europe/London','Asia/Tokyo']

export default function Page() {
  const [iso, setIso] = useState(new Date().toISOString())
  const [from, setFrom] = useState('UTC')
  const [to, setTo] = useState('Asia/Shanghai')
  const out = useMemo(() => {
    try {
      const d = new Date(iso)
      if (isNaN(d.getTime())) return '无效时间'
      const fmt = new Intl.DateTimeFormat('zh-CN', { timeZone: to, hour12: false, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })
      // 解释：Date 内部是 UTC 时间戳，输入 ISO 视为绝对时间；这里只变换显示时区
      return fmt.format(d)
    } catch { return '转换失败' }
  }, [iso, from, to])

  return (
    <div className="space-y-3">
      <Input  variant="simple" className="" value={iso} onChange={(e)=>setIso(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-3">
        <select className="rounded bg-slate-800 p-2" value={from} onChange={(e)=>setFrom(e.target.value)}>{zones.map(z=> <option key={z}>{z}</option>)}</select>
        <select className="rounded bg-slate-800 p-2" value={to} onChange={(e)=>setTo(e.target.value)}>{zones.map(z=> <option key={z}>{z}</option>)}</select>
      </div>
      <div className="rounded bg-slate-800 p-3 font-mono">{out}</div>
    </div>
  )
}
