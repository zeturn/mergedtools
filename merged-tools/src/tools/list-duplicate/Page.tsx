import { useMemo, useState } from 'react'

function splitList(text: string, sep: string){
  if (!sep) return text.split(/\s+/).filter(Boolean)
  return text.split(sep).filter(Boolean)
}

export default function Page(){
  const [input, setInput] = useState('apple banana cherry')
  const [sep, setSep] = useState(' ')
  const [join, setJoin] = useState(' ')
  const [copies, setCopies] = useState('2')
  const [concatenate, setConcatenate] = useState(true)
  const [reverse, setReverse] = useState(false)

  const out = useMemo(()=>{
    const list = splitList(input, sep)
    const n = parseFloat(copies)
    if (Number.isNaN(n) || n<=0) return '复制次数应为正数'
    const full = Math.floor(n)
    const frac = n - full
    const base = reverse ? [...list].reverse() : list
    const batches: string[][] = []
    for (let i=0;i<full;i++) batches.push(base)
    if (frac>0 && base.length){
      const take = Math.max(1, Math.floor(base.length * frac))
      batches.push(base.slice(0, take))
    }
    if (concatenate){
      return batches.flat().join(join)
    } else {
      // 交织：第1轮的第1个、2轮的第1个……依次
      const maxLen = Math.max(...batches.map(b=>b.length))
      const inter: string[] = []
      for (let i=0;i<maxLen;i++) for(const b of batches){ if (i<b.length) inter.push(b[i]) }
      return inter.join(join)
    }
  }, [input, sep, join, copies, concatenate, reverse])

  return (
    <div className="space-y-3">
      <textarea className="textarea h-36" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-2 items-center">
        <input className="input" placeholder="分隔符(留空=空白)" value={sep} onChange={e=>setSep(e.target.value)} />
        <input className="input" placeholder="拼接符" value={join} onChange={e=>setJoin(e.target.value)} />
        <input className="input" placeholder="复制次数(可小数)" value={copies} onChange={e=>setCopies(e.target.value)} />
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={concatenate} onChange={e=>setConcatenate(e.target.checked)} /> 拼接</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={reverse} onChange={e=>setReverse(e.target.checked)} /> 反向</label>
      </div>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
