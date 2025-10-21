import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

export default function Page(){
  const [text, setText] = useState('Na')
  const [sep, setSep] = useState(' ')
  const [count, setCount] = useState(4)
  const out = useMemo(()=> Array.from({ length: Math.max(0, Math.min(1000, count)) }, ()=>text).join(sep), [text, sep, count])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输入</h2>
        <Textarea variant="simple" className="h-48" value={text} onChange={e=>setText(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1"><span className="text-sm text-slate-300">分隔符</span><input className="input" value={sep} onChange={e=>setSep(e.target.value)} /></label>
          <label className="flex flex-col gap-1"><span className="text-sm text-slate-300">次数</span><input type="number" className="input" value={count} onChange={e=>setCount(Number(e.target.value))} /></label>
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输出</h2>
        <Textarea variant="simple" className="h-48" value={out} readOnly />
      </section>
    </div>
  )
}
