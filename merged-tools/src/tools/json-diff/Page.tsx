import { useMemo, useState } from 'react'
import { create } from 'jsondiffpatch'

export default function Page() {
  const [left, setLeft] = useState('{"a":1,"b":[1,2,3]}')
  const [right, setRight] = useState('{"a":2,"b":[1,3]}')
  const out = useMemo(() => {
    try {
      const l = JSON.parse(left)
      const r = JSON.parse(right)
      const jdp = create({})
      const delta = jdp.diff(l, r)
      return JSON.stringify(delta ?? {}, null, 2)
    } catch (e: any) {
      return `解析失败: ${e?.message ?? '未知'}`
    }
  }, [left, right])

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <textarea className="h-64 rounded bg-slate-800 p-3 font-mono" value={left} onChange={(e)=>setLeft(e.target.value)} />
      <textarea className="h-64 rounded bg-slate-800 p-3 font-mono" value={right} onChange={(e)=>setRight(e.target.value)} />
      <pre className="h-64 rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{out}</pre>
    </div>
  )
}
