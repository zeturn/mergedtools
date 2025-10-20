import { useMemo, useState } from 'react'

const MAP: [number, string][] = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
]
function toRoman(n: number) {
  if (!Number.isInteger(n) || n<=0 || n>=4000) throw new Error('范围 1..3999')
  let x = n, out = ''
  for (const [v,s] of MAP) { while (x>=v) { out+=s; x-=v } }
  return out
}
function fromRoman(s: string) {
  const m: Record<string, number> = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000}
  const t = s.toUpperCase().trim()
  if (!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(t)) throw new Error('格式无效')
  let out = 0
  for (let i=0;i<t.length;i++) { const a=m[t[i]], b=m[t[i+1]]; if (b && b>a){ out+=b-a; i++ } else out+=a }
  return out
}

export default function Page(){
  const [n, setN] = useState(1999)
  const [r, setR] = useState('MMXXV')
  const outR = useMemo(()=>{ try{return toRoman(Number(n))}catch(e:any){return '错误: '+(e?.message||'')}} , [n])
  const outN = useMemo(()=>{ try{return String(fromRoman(r))}catch(e:any){return '错误: '+(e?.message||'')}} , [r])
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">整数 → 罗马</h3>
        <input type="number" className="rounded bg-slate-800 p-2" value={n} onChange={(e)=>setN(Number(e.target.value))} />
        <div className="rounded bg-slate-900 p-2 font-mono">{outR}</div>
      </section>
      <section className="space-y-2">
        <h3 className="text-xl font-semibold">罗马 → 整数</h3>
        <input className="rounded bg-slate-800 p-2" value={r} onChange={(e)=>setR(e.target.value)} />
        <div className="rounded bg-slate-900 p-2 font-mono">{outN}</div>
      </section>
    </div>
  )
}
