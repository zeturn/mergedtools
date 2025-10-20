import { useMemo, useState } from 'react'

export default function Page(){
  const [text, setText] = useState('Hello [name], welcome to [place]!')
  const [start, setStart] = useState('[')
  const [end, setEnd] = useState(']')
  const [all, setAll] = useState(true)

  const result = useMemo(()=>{
    if (!start || !end) return [] as string[]
    const out: string[] = []
    let i = 0
    while (i < text.length){
      const a = text.indexOf(start, i)
      if (a === -1) break
      const b = text.indexOf(end, a + start.length)
      if (b === -1) break
      out.push(text.slice(a + start.length, b))
      i = all ? b + end.length : text.length
    }
    return out
  }, [text, start, end, all])

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <L label="开始标记"><input className="input" value={start} onChange={e=>setStart(e.target.value)} /></L>
        <L label="结束标记"><input className="input" value={end} onChange={e=>setEnd(e.target.value)} /></L>
        <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)} /> 提取全部</label>
      </div>
      <textarea className="textarea h-48" value={text} onChange={e=>setText(e.target.value)} />
      <div>
        <h3 className="font-semibold mb-2">结果（{result.length}）</h3>
        <ul className="list-decimal list-inside space-y-1 text-sm">
          {result.map((s, i)=> <li key={i}><code>{s}</code></li>)}
        </ul>
      </div>
    </div>
  )
}

function L({ label, children }: { label: string; children: React.ReactNode }){
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}
