import { useMemo, useState } from 'react'
import * as toml from 'toml'
import yaml from 'js-yaml'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [input, setInput] = useState('title = "Example"\n[owner]\nname = "Tom"')
  const out = useMemo(()=>{
    try { return yaml.dump(toml.parse(input)) } catch(e: any){ return '解析失败：' + (e?.message || e) }
  }, [input])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">TOML</h2>
        <Textarea variant="simple" className="h-64" value={input} onChange={e=>setInput(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">YAML</h2>
        <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap overflow-auto">{out}</pre>
      </section>
    </div>
  )
}
