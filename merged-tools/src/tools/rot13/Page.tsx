import { useMemo, useState } from 'react'

export default function Page(){
  const [input, setInput] = useState('Hello, World!')
  const output = useMemo(()=> rot13(input), [input])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输入</h2>
        <textarea className="textarea h-64" value={input} onChange={e=>setInput(e.target.value)} />
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">输出（ROT13）</h2>
        <textarea className="textarea h-64" value={output} readOnly />
      </section>
    </div>
  )
}

function rot13(s: string){
  return s.replace(/[a-zA-Z]/g, (c)=>{
    const base = c <= 'Z' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0)
    const code = c.charCodeAt(0) - base
    return String.fromCharCode(base + ((code + 13) % 26))
  })
}
