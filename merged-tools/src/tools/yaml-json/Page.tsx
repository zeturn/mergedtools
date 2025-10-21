import { useMemo, useState } from 'react'
import yaml from 'js-yaml'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [y, setY] = useState('name: Alice\nage: 30')
  const [j, setJ] = useState('')
  const outJ = useMemo(()=>{ try{ return JSON.stringify(yaml.load(y), null, 2) }catch{ return '' } }, [y])
  const outY = useMemo(()=>{ try{ return yaml.dump(JSON.parse(j)) }catch{ return '' } }, [j])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">YAML → JSON</h2>
        <Textarea variant="simple" className="h-48" value={y} onChange={(e)=>setY(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{outJ}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">JSON → YAML</h2>
        <Textarea variant="simple" className="h-48" value={j} onChange={(e)=>setJ(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{outY}</pre>
      </section>
    </div>
  )
}
