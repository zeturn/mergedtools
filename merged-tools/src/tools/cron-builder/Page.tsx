import { useMemo, useState } from 'react'
import cronParser from 'cron-parser'

const ranges = {
  minute: Array.from({ length: 60 }, (_, i) => i),
  hour: Array.from({ length: 24 }, (_, i) => i),
  dom: Array.from({ length: 31 }, (_, i) => i + 1),
  month: Array.from({ length: 12 }, (_, i) => i + 1),
  dow: Array.from({ length: 7 }, (_, i) => i),
}

function toExpr(sel: number[], type: keyof typeof ranges) {
  if (sel.length === 0) return '*'
  if (type === 'month' || type === 'dow') return sel.sort((a,b)=>a-b).join(',')
  return sel.sort((a,b)=>a-b).join(',')
}

export default function Page() {
  const [min, setMin] = useState<number[]>([])
  const [hr, setHr] = useState<number[]>([])
  const [dom, setDom] = useState<number[]>([])
  const [mon, setMon] = useState<number[]>([])
  const [dow, setDow] = useState<number[]>([])
  const expr = useMemo(() => `${toExpr(min,'minute')} ${toExpr(hr,'hour')} ${toExpr(dom,'dom')} ${toExpr(mon,'month')} ${toExpr(dow,'dow')}`, [min,hr,dom,mon,dow])
  const preview = useMemo(() => {
    try {
      const it = (cronParser as any).parseExpression(expr, { iterator: true })
      const list: string[] = []
      for (let i = 0; i < 10; i++) list.push(it.next().value.toString())
      return list
    } catch (e: any) { return [`错误: ${e?.message ?? '无'}`] }
  }, [expr])

  function toggle(arr: number[], setArr: (v: number[]) => void, v: number) {
    setArr(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v])
  }

  const pill = 'px-2 py-1 rounded text-sm cursor-pointer'
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-slate-400 text-sm">分钟</div>
        <div className="flex flex-wrap gap-2">
          {ranges.minute.map(v => <button key={v} className={`${pill} ${min.includes(v)?'bg-slate-600':'bg-slate-800 hover:bg-slate-700'}`} onClick={()=>toggle(min,setMin,v)}>{v}</button>)}
        </div>
      </div>
      <div>
        <div className="mb-2 text-slate-400 text-sm">小时</div>
        <div className="flex flex-wrap gap-2">
          {ranges.hour.map(v => <button key={v} className={`${pill} ${hr.includes(v)?'bg-slate-600':'bg-slate-800 hover:bg-slate-700'}`} onClick={()=>toggle(hr,setHr,v)}>{v}</button>)}
        </div>
      </div>
      <div>
        <div className="mb-2 text-slate-400 text-sm">日期(1-31)</div>
        <div className="flex flex-wrap gap-2">
          {ranges.dom.map(v => <button key={v} className={`${pill} ${dom.includes(v)?'bg-slate-600':'bg-slate-800 hover:bg-slate-700'}`} onClick={()=>toggle(dom,setDom,v)}>{v}</button>)}
        </div>
      </div>
      <div>
        <div className="mb-2 text-slate-400 text-sm">月份(1-12)</div>
        <div className="flex flex-wrap gap-2">
          {ranges.month.map(v => <button key={v} className={`${pill} ${mon.includes(v)?'bg-slate-600':'bg-slate-800 hover:bg-slate-700'}`} onClick={()=>toggle(mon,setMon,v)}>{v}</button>)}
        </div>
      </div>
      <div>
        <div className="mb-2 text-slate-400 text-sm">星期(0-6，0=周日)</div>
        <div className="flex flex-wrap gap-2">
          {ranges.dow.map(v => <button key={v} className={`${pill} ${dow.includes(v)?'bg-slate-600':'bg-slate-800 hover:bg-slate-700'}`} onClick={()=>toggle(dow,setDow,v)}>{v}</button>)}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-slate-400">表达式</div>
        <div className="rounded bg-slate-800 p-2 font-mono">{expr}</div>
      </div>
      <div className="space-y-2">
        <div className="text-sm text-slate-400">未来 10 次运行</div>
        <ul className="list-disc pl-6 space-y-1">{preview.map((s,i)=><li key={i} className="font-mono">{s}</li>)}</ul>
      </div>
    </div>
  )
}
