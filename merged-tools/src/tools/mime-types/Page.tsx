import { useMemo, useState } from 'react'

const MAP: Record<string,string> = {
  'html':'text/html','json':'application/json','txt':'text/plain','png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','gif':'image/gif','svg':'image/svg+xml','pdf':'application/pdf','zip':'application/zip'
}

export default function Page(){
  const [q, setQ] = useState('')
  const list = useMemo(()=> Object.entries(MAP).filter(([ext,m])=> `${ext} ${m}`.includes(q.toLowerCase())), [q])
  return (
    <div className="space-y-3">
      <input className="w-full rounded bg-slate-800 p-2" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="输入扩展或 MIME" />
      <div className="rounded bg-slate-900 p-2 font-mono">
        {list.map(([ext,m])=> <div key={ext}><span className="text-slate-400">.{ext}</span> → {m}</div>)}
      </div>
    </div>
  )
}
