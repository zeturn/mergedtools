import { useMemo, useState } from 'react'
import Papa from 'papaparse'

export default function Page(){
  const [input, setInput] = useState('a,b\n1,2\n3,4')
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState('N')
  const [byRowNumber, setByRowNumber] = useState(false)
  const out = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { delimiter: ',', skipEmptyLines: false })
      const rows = parsed.data as string[][]
      const res = rows.map((r, i)=>{
        const v = byRowNumber ? String(i) : value
        const rr = r.slice()
        const idx = Math.max(0, Math.min(rr.length, index))
        rr.splice(idx, 0, v)
        return rr
      })
      return Papa.unparse(res)
    }catch(e: any){
      return String(e?.message || e)
    }
  }, [input, index, value, byRowNumber])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <L label="插入位置"><input type="number" className="input" value={index} onChange={e=>setIndex(Number(e.target.value))} /></L>
        <L label="列值"><input className="input" value={value} onChange={e=>setValue(e.target.value)} disabled={byRowNumber} /></L>
        <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={byRowNumber} onChange={e=>setByRowNumber(e.target.checked)} /> 使用行号</label>
      </div>
      <textarea className="textarea h-48" value={input} onChange={e=>setInput(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }){
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}
