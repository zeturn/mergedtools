import { useMemo, useState } from 'react'

function rotate<T>(arr: T[], k: number){
  const n = arr.length
  if (!n) return arr
  const m = ((k % n) + n) % n
  return arr.slice(n-m).concat(arr.slice(0, n-m))
}

export default function Page(){
  const [input, setInput] = useState('a b c d e f')
  const [sep, setSep] = useState(' ')
  const [k, setK] = useState('2')
  const out = useMemo(()=>{
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    const n = parseInt(k,10)
    if (Number.isNaN(n)) return '位移应为整数'
    return rotate(arr, n).join(sep || ' ')
  }, [input, sep, k])
  return (
    <div className="space-y-3">
      <textarea className="textarea h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-2 gap-2">
        <input className="input" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <input className="input" placeholder="位移(可负)" value={k} onChange={e=>setK(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
