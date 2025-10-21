import { useMemo, useState } from 'react'
import Input from '../../components/Input'

export default function Page(){
  const [a1, setA1] = useState('1')
  const [d, setD] = useState('2')
  const [n, setN] = useState('10')
  const out = useMemo(()=>{
    const A1 = parseFloat(a1), D = parseFloat(d), N = parseInt(n,10)
    if ([A1,D,N].some(v=>Number.isNaN(v))) return '请输入数字'
    if (N<=0) return '项数需>0'
    const arr = Array.from({length:N}, (_,i)=> A1 + i*D)
    const sum = arr.reduce((s,x)=>s+x,0)
    return `序列: ${arr.join(', ')}\n和: ${sum}`
  }, [a1,d,n])

  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-2">
        <Input  variant="simple" placeholder="首项" value={a1} onChange={e=>setA1(e.target.value)} />
        <Input  variant="simple" placeholder="公差" value={d} onChange={e=>setD(e.target.value)} />
        <Input  variant="simple" placeholder="项数" value={n} onChange={e=>setN(e.target.value)} />
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
