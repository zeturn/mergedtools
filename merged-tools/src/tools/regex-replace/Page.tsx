import { useMemo, useState } from 'react'

export default function Page() {
  const [input, setInput] = useState('foo 123 bar 456')
  const [pattern, setPattern] = useState('(\d+)')
  const [flags, setFlags] = useState('g')
  const [replacement, setReplacement] = useState('[$1]')
  const out = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags)
      return input.replace(re, replacement)
    } catch (e: any) {
      return `错误: ${e?.message ?? '无'}`
    }
  }, [input, pattern, flags, replacement])

  return (
    <div className="space-y-3">
      <textarea className="w-full h-32 rounded bg-slate-800 p-3 font-mono" value={input} onChange={(e)=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-3">
        <input className="rounded bg-slate-800 p-2 font-mono" value={pattern} onChange={(e)=>setPattern(e.target.value)} placeholder="正则表达式" />
        <input className="rounded bg-slate-800 p-2 font-mono" value={flags} onChange={(e)=>setFlags(e.target.value)} placeholder="标志，如 gmi" />
        <input className="rounded bg-slate-800 p-2 font-mono" value={replacement} onChange={(e)=>setReplacement(e.target.value)} placeholder="替换模板，支持 $1 等" />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono whitespace-pre-wrap overflow-auto">{out}</pre>
    </div>
  )
}
