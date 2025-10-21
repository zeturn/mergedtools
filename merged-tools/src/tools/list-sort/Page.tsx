import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('10 2 33 4')
  const [sep, setSep] = useState(' ')
  const [numeric, setNumeric] = useState(true)
  const [asc, setAsc] = useState(true)
  const out = useMemo(()=>{
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    const cmp = numeric
      ? (a:string,b:string)=> (parseFloat(a)-parseFloat(b))
      : (a:string,b:string)=> a.localeCompare(b)
    const sorted = [...arr].sort(cmp)
    if(!asc) sorted.reverse()
    return sorted.join(sep || ' ')
  }, [input, sep, numeric, asc])
  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="flex flex-wrap gap-4 text-sm items-center">
        <input className="input w-40" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={numeric} onChange={e=>setNumeric(e.target.checked)} /> 数字排序</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={asc} onChange={e=>setAsc(e.target.checked)} /> 升序</label>
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
