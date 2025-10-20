import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('[a] [b] [c]')
  const [sep, setSep] = useState(' ')
  const [pattern, setPattern] = useState('^\\[(.*)\\]$')
  const out = useMemo(()=>{
    const re = new RegExp(pattern)
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    return arr.map(x=>{
      const m = x.match(re)
      return m ? (m[1] ?? x) : x
    }).join(sep || ' ')
  }, [input, sep, pattern])
  return (
    <div className="space-y-3">
      <textarea className="textarea h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-2">
        <input className="input" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <input className="input" placeholder="正则，如 ^\\[(.*)\\]$" value={pattern} onChange={e=>setPattern(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
