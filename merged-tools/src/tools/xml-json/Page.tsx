import { useMemo, useState } from 'react'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_' })

export default function Page() {
  const [x, setX] = useState('<note><to>Tove</to><from>Jani</from></note>')
  const [j, setJ] = useState('')
  const outJ = useMemo(() => {
    try { return JSON.stringify(parser.parse(x), null, 2) } catch { return '' }
  }, [x])
  const outX = useMemo(() => {
    try { return builder.build(JSON.parse(j)) } catch { return '' }
  }, [j])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">XML → JSON</h2>
        <textarea className="w-full h-48 rounded bg-slate-800 p-3 font-mono" value={x} onChange={(e) => setX(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{outJ}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">JSON → XML</h2>
        <textarea className="w-full h-48 rounded bg-slate-800 p-3 font-mono" value={j} onChange={(e) => setJ(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{outX}</pre>
      </section>
    </div>
  )
}
