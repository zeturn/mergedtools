import { useMemo, useState } from 'react'

function shuffle<T>(arr: T[]): T[]{
  const a = [...arr]
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[a[i],a[j]] = [a[j],a[i]]
  }
  return a
}

export default function Page(){
  const [input, setInput] = useState('a b c d e f')
  const [sep, setSep] = useState(' ')
  const out = useMemo(()=>{
    const arr = (sep? input.split(sep): input.split(/\s+/)).filter(Boolean)
    return shuffle(arr).join(sep || ' ')
  }, [input, sep])
  return (
    <div className="space-y-3">
      <textarea className="textarea h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <input className="input" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
