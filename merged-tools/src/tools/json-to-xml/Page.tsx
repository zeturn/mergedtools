import { useMemo, useState } from 'react'
import { XMLBuilder } from 'fast-xml-parser'

const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_' })

export default function Page(){
  const [input, setInput] = useState('{"root":{"name":"Alice","age":30}}')
  const out = useMemo(()=>{
    try { return builder.build(JSON.parse(input)) } catch(e: any){ return '解析失败：' + (e?.message || e) }
  }, [input])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">JSON</h2>
        <textarea className="textarea h-64" value={input} onChange={e=>setInput(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">XML</h2>
        <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap overflow-auto">{out}</pre>
      </section>
    </div>
  )
}
