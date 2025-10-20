import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('a b c d e f g')
  const [sep, setSep] = useState(' ')
  const [n, setN] = useState('3')
  const [from, setFrom] = useState<'head'|'tail'>('head')
  const out = useMemo(()=>{
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    const k = parseInt(n,10)
    if (Number.isNaN(k) || k<0) return 'N 应为非负整数'
    const res = from==='head' ? arr.slice(0,k) : arr.slice(-k)
    return res.join(sep || ' ')
  }, [input, sep, n, from])
  return (
    <div className="space-y-3">
      <textarea className="textarea h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-2">
        <input className="input" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <input className="input" placeholder="N" value={n} onChange={e=>setN(e.target.value)} />
        <select className="input" value={from} onChange={e=>setFrom(e.target.value as any)}>
          <option value="head">前 N</option>
          <option value="tail">后 N</option>
        </select>
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
