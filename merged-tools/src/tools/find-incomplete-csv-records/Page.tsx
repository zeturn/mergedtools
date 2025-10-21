import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('a,b,c\n1,2\n3,4,5,6\n7,8,9')
  const report = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { delimiter: ',', skipEmptyLines: false })
      const rows = parsed.data as string[][]
      const lens = rows.map(r=> r.length)
      const expected = mode(lens)
      const bad = rows.map((r,i)=> ({ i, len: r.length })).filter(x=> x.len !== expected)
      return { expected, bad }
    }catch(e: any){
      return { expected: 0, bad: [], err: String(e?.message || e) }
    }
  }, [input])

  return (
    <div className="space-y-4">
      <Textarea variant="simple" className="h-48" value={input} onChange={e=>setInput(e.target.value)} />
      {'err' in report && report.err ? (
        <div className="rounded bg-rose-900/40 p-3">{report.err}</div>
      ) : (
        <div className="rounded bg-slate-800 p-3 text-sm">
          <div className="mb-2">期望字段数：{report.expected}</div>
          {report.bad.length ? (
            <ul className="list-disc list-inside space-y-1">
              {report.bad.map(x=> <li key={x.i}>第 {x.i+1} 行 字段数={x.len}</li>)}
            </ul>
          ) : (
            <div>所有记录字段数一致 ✅</div>
          )}
        </div>
      )}
    </div>
  )
}

function mode(nums: number[]){
  const m = new Map<number, number>()
  for (const n of nums) m.set(n, (m.get(n) ?? 0) + 1)
  let best = nums[0] ?? 0, cnt = -1
  for (const [k, v] of m){ if (v > cnt){ best = k; cnt = v } }
  return best
}
