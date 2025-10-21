import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('a,b,c\n1,2,3\n4,5,6')
  const out = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { delimiter: ',', skipEmptyLines: false })
      const rows = parsed.data as any[]
      const maxLen = rows.reduce((m, r) => Math.max(m, (r as any[]).length), 0)
      const transposed = Array.from({ length: maxLen }, (_, i) => rows.map(r => (r as any[])[i] ?? ''))
      return Papa.unparse(transposed)
    }catch(e: any){
      return String(e?.message || e)
    }
  }, [input])

  return (
    <div className="space-y-4">
      <Textarea variant="simple" className="h-48" value={input} onChange={e=>setInput(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
