import { useMemo, useState } from 'react'

function hslToHex(h:number,s:number,l:number){
  s/=100; l/=100
  const k = (n:number)=> (n + h/30) % 12
  const a = s*Math.min(l,1-l)
  const f = (n:number)=> l - a*Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n),1)))
  const to255 = (x:number)=> Math.round(255*f(x))
  return '#'+[to255(0),to255(8),to255(4)].map(x=>x.toString(16).padStart(2,'0')).join('')
}

export default function Page(){
  const [h, setH] = useState(220)
  const [s, setS] = useState(80)
  const [l, setL] = useState(55)
  const [mode, setMode] = useState<'complementary'|'triadic'|'tetradic'|'analogous'|'monochrome'>('triadic')

  const colors = useMemo(()=>{
    const hues: number[] = []
    if(mode==='complementary') hues.push(h, (h+180)%360)
    else if(mode==='triadic') hues.push(h, (h+120)%360, (h+240)%360)
    else if(mode==='tetradic') hues.push(h, (h+90)%360, (h+180)%360, (h+270)%360)
    else if(mode==='analogous') hues.push(h, (h+30)%360, (h+330)%360)
    else if(mode==='monochrome') hues.push(h)
    const base = hues.map(H=> hslToHex(H, s, l))
    const tints = [10,20,30].map(x=> hslToHex(h, s- x, Math.min(95,l+x)))
    const shades = [10,20,30].map(x=> hslToHex(h, Math.min(100,s+x/2), Math.max(5,l-x)))
    return { base, tints, shades }
  }, [h,s,l,mode])

  const presets = [
    { name:'Ocean', h:200, s:80, l:50 },
    { name:'Sunset', h:20, s:85, l:55 },
    { name:'Forest', h:130, s:60, l:45 },
    { name:'Rose', h:350, s:70, l:55 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <span className="text-sm text-slate-400">H</span>
        <input type="number" className="w-24 rounded bg-slate-800 p-2" value={h} onChange={(e)=>setH(Number(e.target.value)%360)} />
        <span className="text-sm text-slate-400">S</span>
        <input type="number" className="w-24 rounded bg-slate-800 p-2" value={s} onChange={(e)=>setS(Number(e.target.value))} />
        <span className="text-sm text-slate-400">L</span>
        <input type="number" className="w-24 rounded bg-slate-800 p-2" value={l} onChange={(e)=>setL(Number(e.target.value))} />
        <select className="rounded bg-slate-800 p-2" value={mode} onChange={(e)=>setMode(e.target.value as any)}>
          <option value="monochrome">单色</option>
          <option value="analogous">邻近</option>
          <option value="complementary">互补</option>
          <option value="triadic">三分</option>
          <option value="tetradic">四分</option>
        </select>
        {presets.map(p=> <button key={p.name} className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>{setH(p.h);setS(p.s);setL(p.l)}}>{p.name}</button>)}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-slate-400">基色</div>
          <div className="grid grid-cols-5 gap-2">{colors.base.map(c=> <div key={c} className="h-12 rounded" style={{background:c}} title={c}></div>)}</div>
        </div>
        <div>
          <div className="text-sm text-slate-400">浅色（tints）</div>
          <div className="grid grid-cols-3 gap-2">{colors.tints.map(c=> <div key={c} className="h-12 rounded" style={{background:c}} title={c}></div>)}</div>
        </div>
        <div>
          <div className="text-sm text-slate-400">深色（shades）</div>
          <div className="grid grid-cols-3 gap-2">{colors.shades.map(c=> <div key={c} className="h-12 rounded" style={{background:c}} title={c}></div>)}</div>
        </div>
      </div>
    </div>
  )
}
