import { useEffect, useMemo, useState } from 'react'

let tomlify: { toToml: (obj: any, opts?: any) => string } | null = null

export default function Page(){
  const [input, setInput] = useState('{"title":"Example","owner":{"name":"Tom"}}')
  const [ready, setReady] = useState(false)
  useEffect(()=>{ (async ()=>{ try{ const m = await import('tomlify-j0.4'); tomlify = (m as any) } finally { setReady(true) } })() }, [])
  const out = useMemo(()=>{
    try { return tomlify ? tomlify.toToml(JSON.parse(input), { space: 2 }) : '加载 tomlify…' } catch(e: any){ return '解析失败：' + (e?.message || e) }
  }, [input, ready])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">JSON</h2>
        <textarea className="textarea h-64" value={input} onChange={e=>setInput(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">TOML</h2>
        <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap overflow-auto">{out}</pre>
      </section>
    </div>
  )
}
