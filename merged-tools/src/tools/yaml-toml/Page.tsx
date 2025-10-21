import { useEffect, useMemo, useState } from 'react'
import yaml from 'js-yaml'
import * as toml from 'toml'
import { Textarea } from '../../components/Input'
let tomlify: { toToml: (obj: any, opts?: any) => string } | null = null

export default function Page(){
  const [y, setY] = useState('title: Example\nowner:\n  name: Tom')
  const [t, setT] = useState('')
  const [ready, setReady] = useState(false)
  useEffect(()=>{ (async ()=>{ try{ const m = await import('tomlify-j0.4'); tomlify = (m as any) } finally { setReady(true) } })() }, [])
  const outT = useMemo(()=>{ try{ return tomlify? tomlify.toToml(yaml.load(y), { space: 2 }) : '' }catch{ return '' } }, [y, ready])
  const outY = useMemo(()=>{ try{ return yaml.dump(toml.parse(t)) }catch{ return '' } }, [t])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">YAML → TOML</h2>
        <Textarea variant="simple" className="h-48" value={y} onChange={(e)=>setY(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{ready? outT : '加载 tomlify…'}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">TOML → YAML</h2>
        <Textarea variant="simple" className="h-48" value={t} onChange={(e)=>setT(e.target.value)} />
        <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{outY}</pre>
      </section>
    </div>
  )
}
