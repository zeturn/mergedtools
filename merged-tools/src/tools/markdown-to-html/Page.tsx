import { useEffect, useMemo, useState } from 'react'

let snark: ((md: string)=>string) | null = null

export default function Page(){
  const [md, setMd] = useState('# Title\n\n- item 1\n- item 2\n\n`code`')
  const [ready, setReady] = useState(false)
  useEffect(()=>{ (async ()=>{ const m = await import('snarkdown'); snark = (m as any).default ?? (m as any); setReady(true) })() }, [])
  const html = useMemo(()=> ready && snark ? snark(md) : '', [md, ready])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">Markdown</h3>
        <textarea className="w-full h-64 rounded bg-slate-800 p-2 font-mono" value={md} onChange={(e)=>setMd(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">HTML（未消毒）</h3>
        <div className="rounded bg-white text-black p-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: html || '加载中…' }} />
      </section>
    </div>
  )
}
