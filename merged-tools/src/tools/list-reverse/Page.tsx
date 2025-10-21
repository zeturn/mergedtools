import { useMemo, useState } from 'react'
import { Input, Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('a b c d e')
  const [sep, setSep] = useState(' ')
  const out = useMemo(()=>{
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    return arr.reverse().join(sep || ' ')
  }, [input, sep])
  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <Input  variant="simple" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
