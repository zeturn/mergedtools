import { useMemo, useState } from 'react'
import { Input, Textarea } from '../../components/Input'

function count(items: string[]){
  const map = new Map<string, number>()
  for (const it of items){ map.set(it, (map.get(it)||0)+1) }
  return [...map.entries()].sort((a,b)=> b[1]-a[1])
}

export default function Page(){
  const [input, setInput] = useState('a b a c a b d')
  const [sep, setSep] = useState(' ')
  const out = useMemo(()=>{
    const items = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    const pairs = count(items)
    if (!pairs.length) return '空列表'
    const top = pairs[0]
    const lines = pairs.map(([k,v])=> `${k}: ${v}`)
    return `最常见: ${top[0]} (${top[1]})\n\n明细:\n${lines.join('\n')}`
  }, [input, sep])

  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <Input  variant="simple" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
