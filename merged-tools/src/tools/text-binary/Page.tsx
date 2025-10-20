import { useMemo, useState } from 'react'

export default function Page(){
  const [t, setT] = useState('Hello')
  const out = useMemo(()=> t.split('').map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '), [t])
  return (
    <div className="space-y-3">
      <textarea className="w-full h-40 rounded bg-slate-800 p-2 font-mono" value={t} onChange={(e)=>setT(e.target.value)} />
      <div className="rounded bg-slate-900 p-2 font-mono break-words">{out}</div>
    </div>
  )
}
