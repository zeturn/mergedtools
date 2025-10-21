import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function reverseString(s: string){
  return [...s].reverse().join('')
}

export default function Page(){
  const [text, setText] = useState('abc😊def')
  const out = useMemo(()=> reverseString(text), [text])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输入</h2>
        <Textarea variant="simple" className="h-48" value={text} onChange={e=>setText(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输出</h2>
        <Textarea variant="simple" className="h-48" value={out} readOnly />
      </section>
    </div>
  )
}
