import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [text, setText] = useState('{"name":"Alice","skills":["ts","react"],"info":{"age":30}}')
  const data = useMemo(()=>{
    try { return JSON.parse(text) } catch { return null }
  }, [text])

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输入 JSON</h2>
        <Textarea variant="simple" className="h-72" value={text} onChange={e=>setText(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">树形查看</h2>
        <div className="rounded bg-slate-800 p-3 text-sm overflow-auto">
          {data ? <Tree node={data} path={''} /> : <div className="text-rose-300">解析失败</div>}
        </div>
      </section>
    </div>
  )
}

function Tree({ node, path }: { node: any; path: string }){
  if (node === null || typeof node !== 'object') {
    return <KV k={path.split('.').pop() ?? ''} v={String(node)} type={typeof node} isLeaf />
  }
  const entries = Array.isArray(node) ? node.map((v, i) => [String(i), v] as const) : Object.entries(node)
  return (
    <div className="space-y-1">
      {entries.map(([k, v]) => <Branch key={k} k={k} v={v} />)}
    </div>
  )
}

function Branch({ k, v }: { k: string; v: any }){
  const [open, setOpen] = useState(true)
  const isObj = v !== null && typeof v === 'object'
  return (
    <div>
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={()=>setOpen(o=>!o)}>
        <span className="inline-flex w-4 justify-center text-slate-400">{isObj ? (open ? '▾' : '▸') : '•'}</span>
        <span className="text-amber-300">{k}</span>
        {!isObj && <span className="text-slate-400">: <Val v={v} /></span>}
      </div>
      {isObj && open && (
        <div className="ml-5 border-l border-slate-700 pl-3 mt-1">
          <Tree node={v} path={k} />
        </div>
      )}
    </div>
  )
}

function Val({ v }: { v: any }){
  const t = typeof v
  const cls = t === 'string' ? 'text-emerald-300' : t === 'number' ? 'text-sky-300' : t === 'boolean' ? 'text-purple-300' : 'text-slate-300'
  return <span className={cls}>{t === 'string' ? JSON.stringify(v) : String(v)}</span>
}

function KV({ k, v, type }: { k: string; v: string; type: string; isLeaf?: boolean }){
  const cls = type === 'string' ? 'text-emerald-300' : type === 'number' ? 'text-sky-300' : type === 'boolean' ? 'text-purple-300' : 'text-slate-300'
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex w-4 justify-center text-slate-400">•</span>
      <span className="text-amber-300">{k}</span>
      <span className="text-slate-400">: <span className={cls}>{v}</span></span>
    </div>
  )
}
