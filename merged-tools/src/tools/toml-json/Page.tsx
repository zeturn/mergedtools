import { useEffect, useMemo, useState } from 'react'
import * as toml from 'toml'
let tomlify: { toToml: (obj: any, opts?: any) => string } | null = null

export default function Page() {
  const [t, setT] = useState('title = "Example"\n[owner]\nname = "Tom"')
  const [j, setJ] = useState('')
  const [ready, setReady] = useState(false)
  useEffect(() => { (async () => { try { const m = await import('tomlify-j0.4'); tomlify = (m as any) as any } finally { setReady(true) } })() }, [])
  const outJ = useMemo(() => {
    try { return JSON.stringify(toml.parse(t), null, 2) } catch { return '' }
  }, [t])
  const outT = useMemo(() => {
    try { return tomlify ? tomlify.toToml(JSON.parse(j), { space: 2 }) : '' } catch { return '' }
  }, [j, ready])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">TOML → JSON</h2>
        <textarea className="w-full h-48 rounded bg-slate-800 p-3 font-mono" value={t} onChange={(e) => setT(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{outJ}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">JSON → TOML</h2>
        <textarea className="w-full h-48 rounded bg-slate-800 p-3 font-mono" value={j} onChange={(e) => setJ(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{ready ? outT : '加载 tomlify…'}</pre>
      </section>
    </div>
  )
}
