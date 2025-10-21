import { useMemo, useState } from 'react'
import Papa from 'papaparse'
import yaml from 'js-yaml'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('id,name\n1,Alice\n2,Bob')
  const out = useMemo(()=>{
    try{
      const parsed = Papa.parse<string[]>(input, { header: true, skipEmptyLines: true })
      const rows = parsed.data as any[]
      return yaml.dump(rows)
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
