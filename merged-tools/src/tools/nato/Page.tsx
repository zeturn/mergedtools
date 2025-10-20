import { useMemo, useState } from 'react'

const MAP: Record<string, string> = {
  A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliett',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu'
}

export default function Page(){
  const [t, setT] = useState('Hello-42')
  const out = useMemo(()=> t.split('').map(ch => {
    const up = ch.toUpperCase()
    if (MAP[up]) return MAP[up]
    if (/\d/.test(ch)) return ch.split('').map(d => ({'0':'Zero','1':'One','2':'Two','3':'Three','4':'Four','5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Nine'} as any)[d]).join(' ')
    return ch
  }).join(' '), [t])
  return (
    <div className="space-y-3">
      <textarea className="w-full h-32 rounded bg-slate-800 p-2" value={t} onChange={(e)=>setT(e.target.value)} />
      <div className="rounded bg-slate-900 p-2 font-mono whitespace-pre-wrap break-words">{out}</div>
    </div>
  )
}
