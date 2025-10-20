import { useMemo, useState } from 'react'
import he from 'he'

export default function Page() {
  const [raw, setRaw] = useState('<div class="x">你好 & welcome</div>')
  const enc = useMemo(() => he.encode(raw, { allowUnsafeSymbols: true }), [raw])
  const [ent, setEnt] = useState('&lt;div class="x"&gt;你好 &amp; welcome&lt;/div&gt;')
  const dec = useMemo(() => he.decode(ent), [ent])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">编码</h2>
        <textarea className="w-full h-40 rounded bg-slate-800 p-3 font-mono" value={raw} onChange={(e) => setRaw(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{enc}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">解码</h2>
        <textarea className="w-full h-40 rounded bg-slate-800 p-3 font-mono" value={ent} onChange={(e) => setEnt(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{dec}</pre>
      </section>
    </div>
  )
}
