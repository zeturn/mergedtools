import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('a,b\n1,2\n3,4')
  const out = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { delimiter: ',', skipEmptyLines: false })
      return Papa.unparse(parsed.data as any, { delimiter: '\t' })
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
