import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function isLeap(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)
}

export default function Page(){
  const [years, setYears] = useState('1999\n2000\n2004\n2100')
  const out = useMemo(()=>{
    return years.split(/\r?\n/).filter(Boolean).map((line)=>{
      const n = parseInt(line.trim(), 10)
      if (Number.isNaN(n)) return `${line} -> 无效年份`
      return `${n} -> ${isLeap(n) ? '闰年' : '平年'}`
    }).join('\n')
  }, [years])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Textarea variant="simple" className="h-56" value={years} onChange={e=>setYears(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
