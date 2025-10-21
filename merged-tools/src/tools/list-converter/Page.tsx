import { useMemo, useState } from 'react'
import { Textarea } from '../../components/Input'

function split(input: string, sep: string){
  if(sep==='newline') return input.split(/\r?\n/)
  if(sep==='comma') return input.split(/\s*,\s*/)
  if(sep==='tab') return input.split(/\t/)
  return input.split(sep)
}

export default function Page(){
  const [input, setInput] = useState('a\nb\nc')
  const [inSep, setInSep] = useState<'newline'|'comma'|'tab'|'custom'>('newline')
  const [outSep, setOutSep] = useState<'newline'|'comma'|'tab'|'custom'>('comma')
  const [customIn, setCustomIn] = useState(' | ')
  const [customOut, setCustomOut] = useState(', ')
  const [trim, setTrim] = useState(true)
  const [unique, setUnique] = useState(true)
  const [sort, setSort] = useState<'none'|'asc'|'desc'>('none')
  const items = useMemo(()=>{
    let arr = split(input, inSep==='custom'?customIn:inSep)
    if(trim) arr = arr.map(s=>s.trim()).filter(Boolean)
    if(unique) arr = Array.from(new Set(arr))
    if(sort==='asc') arr = arr.slice().sort((a,b)=>a.localeCompare(b))
    if(sort==='desc') arr = arr.slice().sort((a,b)=>b.localeCompare(a))
    return arr
  },[input,inSep,customIn,trim,unique,sort])
  const out = useMemo(()=>{
    const sep = outSep==='newline'?'\n': outSep==='comma'? ', ' : outSep==='tab'? '\t' : customOut
    return items.join(sep)
  },[items,outSep,customOut])
  return (
    <div className="space-y-3">
      <Textarea variant="simple" className="h-44" value={input} onChange={e=>setInput(e.target.value)} />
      <div className="grid md:grid-cols-3 gap-2 text-sm">
        <label>输入分隔符<select className="select" value={inSep} onChange={e=>setInSep(e.target.value as any)}>
          <option value="newline">换行</option>
          <option value="comma">逗号</option>
          <option value="tab">制表符</option>
          <option value="custom">自定义</option>
        </select></label>
        {inSep==='custom' && <input className="input" placeholder="自定义输入分隔符" value={customIn} onChange={e=>setCustomIn(e.target.value)} />}
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={e=>setTrim(e.target.checked)} />裁剪/过滤空值</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={unique} onChange={e=>setUnique(e.target.checked)} />去重</label>
        <label>排序<select className="select" value={sort} onChange={e=>setSort(e.target.value as any)}>
          <option value="none">不排序</option>
          <option value="asc">升序</option>
          <option value="desc">降序</option>
        </select></label>
        <label>输出分隔符<select className="select" value={outSep} onChange={e=>setOutSep(e.target.value as any)}>
          <option value="newline">换行</option>
          <option value="comma">逗号</option>
          <option value="tab">制表符</option>
          <option value="custom">自定义</option>
        </select></label>
        {outSep==='custom' && <input className="input" placeholder="自定义输出分隔符" value={customOut} onChange={e=>setCustomOut(e.target.value)} />}
      </div>
      <Textarea variant="simple" className="h-44" readOnly value={out} />
    </div>
  )
}
