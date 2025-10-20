import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('a a b c c d e')
  const [sep, setSep] = useState(' ')
  const [mode, setMode] = useState<'dedupe'|'unique-only'>('dedupe')
  const out = useMemo(()=>{
    const items = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    const map = new Map<string, number>()
    for (const it of items) map.set(it, (map.get(it)||0)+1)
    const res = mode==='dedupe' ? [...map.keys()] : [...map.entries()].filter(([,v])=>v===1).map(([k])=>k)
    return res.join(sep || ' ')
  }, [input, sep, mode])
  return (
    <div className="space-y-3">
      <textarea className="textarea h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <select className="input" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="dedupe">去重</option>
          <option value="unique-only">仅唯一项</option>
        </select>
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
