import { useMemo, useState } from 'react'

function toU(cp: number){ return 'U+' + cp.toString(16).toUpperCase().padStart(4,'0') }

export default function Page(){
  const [t, setT] = useState('A中')
  const out = useMemo(()=> t.split('').map(c=>{
    const cp = c.codePointAt(0) || 0
    return `${c} → ${toU(cp)} ` + '\\u{' + cp.toString(16) + '}'
  }).join('\n'), [t])
  return (
    <div className="space-y-3">
      <textarea className="w-full h-40 rounded bg-slate-800 p-2 font-mono" value={t} onChange={(e)=>setT(e.target.value)} />
      <pre className="rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap">{out}</pre>
    </div>
  )
}
