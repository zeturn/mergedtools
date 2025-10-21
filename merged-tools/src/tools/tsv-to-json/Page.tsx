import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('name\tage\nAlice\t18\nBob\t20')
  const [header, setHeader] = useState(true)
  const out = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { delimiter: '\t', skipEmptyLines: false })
      const rows = parsed.data as any[][]
      if (!rows.length) return '[]'
      if (header){
        const [head, ...rest] = rows
        const list = rest.map(r=> Object.fromEntries(head.map((h,i)=> [h, r[i]])))
        return JSON.stringify(list, null, 2)
      } else {
        return JSON.stringify(rows, null, 2)
      }
    }catch(e:any){
      return e.message || String(e)
    }
  }, [input, header])

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2"><input type="checkbox" checked={header} onChange={e=>setHeader(e.target.checked)} /> 第一行为表头</label>
      <div className="grid md:grid-cols-2 gap-6">
        <Textarea variant="simple" className="h-52" value={input} onChange={e=>setInput(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
      </div>
    </div>
  )
}
