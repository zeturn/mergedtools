import { useMemo, useState } from 'react'

const RESERVED = new Set<number>([
  // 0-1023 well-known; we avoid 0-1023 entirely by range filter
  3306, 5432, 27017, 6379, 8080, 3000, 3001, 8000, 8001, 4200, 5000, 9000, 9090, 9200, 9300, 15672, 15692, 15671
])

function gen(n: number, min=1024, max=65535, avoid=RESERVED){
  const out: number[] = []
  while(out.length < n){
    const p = Math.floor(Math.random()*(max-min+1))+min
    if(!avoid.has(p)) out.push(p)
  }
  return out
}

export default function Page(){
  const [count, setCount] = useState(10)
  const [min, setMin] = useState(1024)
  const [max, setMax] = useState(65535)
  const [list, setList] = useState<number[]>([])
  const valid = useMemo(()=> min>=0 && max<=65535 && min<=max && count>0 && count<=1000,[min,max,count])
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-4 gap-2">
        <label className="flex items-center gap-2">数量<input className="input" type="number" value={count} onChange={e=>setCount(parseInt(e.target.value||'0'))} /></label>
        <label className="flex items-center gap-2">最小<input className="input" type="number" value={min} onChange={e=>setMin(parseInt(e.target.value||'0'))} /></label>
        <label className="flex items-center gap-2">最大<input className="input" type="number" value={max} onChange={e=>setMax(parseInt(e.target.value||'0'))} /></label>
        <button className="btn" disabled={!valid} onClick={()=>setList(gen(count,min,max))}>生成</button>
      </div>
      {!!list.length && <textarea className="textarea h-48" readOnly value={list.join('\n')} />}
      <div className="text-xs text-gray-500">提示：纯前端无法检测目标机器端口占用；此列表仅作建议，实际使用前请在目标环境验证可用性。</div>
    </div>
  )
}
