import { useEffect, useState } from 'react'

function cToAll(c: number){
  const f = c*9/5+32
  const k = c+273.15
  const r = (c+273.15)*9/5
  return { c, f, k, r }
}
function round(n: number){ return Math.round(n*1000)/1000 }

export default function Page(){
  const [c, setC] = useState('0')
  const [f, setF] = useState('32')
  const [k, setK] = useState('273.15')
  const [r, setR] = useState('491.67')
  function syncFromC(v: string){
    setC(v)
    const cv = parseFloat(v)
    if(isNaN(cv)) return
    const t = cToAll(cv)
    setF(String(round(t.f)))
    setK(String(round(t.k)))
    setR(String(round(t.r)))
  }
  useEffect(()=>{ syncFromC('0') },[])
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <label className="flex items-center gap-2">摄氏 °C<input className="input" value={c} onChange={e=>syncFromC(e.target.value)} /></label>
        <label className="flex items-center gap-2">华氏 °F<input className="input" value={f} onChange={e=>{
          const fv = parseFloat(e.target.value); setF(e.target.value); if(!isNaN(fv)) syncFromC(String((fv-32)*5/9))
        }} /></label>
        <label className="flex items-center gap-2">开尔文 K<input className="input" value={k} onChange={e=>{
          const kv = parseFloat(e.target.value); setK(e.target.value); if(!isNaN(kv)) syncFromC(String(kv-273.15))
        }} /></label>
        <label className="flex items-center gap-2">兰氏 °R<input className="input" value={r} onChange={e=>{
          const rv = parseFloat(e.target.value); setR(e.target.value); if(!isNaN(rv)) syncFromC(String(rv*5/9-273.15))
        }} /></label>
      </div>
    </div>
  )
}
