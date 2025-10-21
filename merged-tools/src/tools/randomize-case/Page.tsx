import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function randomizeCase(s: string){
  return s.split('').map(ch => {
    if (/[a-zA-Z]/.test(ch)) return Math.random() < 0.5 ? ch.toLowerCase() : ch.toUpperCase()
    return ch
  }).join('')
}

export default function Page(){
  const [text, setText] = useState('Random Case Example!')
  const [live, setLive] = useState(true)
  const out = useMemo(()=> live ? randomizeCase(text) : text, [text, live])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输入</h2>
        <Textarea variant="simple" className="h-48" value={text} onChange={e=>setText(e.target.value)} />
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={live} onChange={e=>setLive(e.target.checked)} /> 实时随机</label>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输出</h2>
        <Textarea variant="simple" className="h-48" value={out} readOnly />
      </section>
    </div>
  )
}
