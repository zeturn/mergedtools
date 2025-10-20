import { useState } from 'react'

function fmt(bytes: Uint8Array){ return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join(':') }

export default function Page(){
  const [list, setList] = useState<string[]>([])
  function gen(n=5){
    const out: string[] = []
    for (let i=0;i<n;i++){
      const b = new Uint8Array(6); crypto.getRandomValues(b)
      b[0] = (b[0] | 0x02) & 0xFE // set local bit, clear multicast bit
      out.push(fmt(b))
    }
    setList(out)
  }
  return (
    <div className="space-y-3">
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>gen(10)}>生成 10 个</button>
      <div className="rounded bg-slate-900 p-2 font-mono space-y-1">
        {list.map(x=> <div key={x}>{x}</div>)}
      </div>
    </div>
  )
}
