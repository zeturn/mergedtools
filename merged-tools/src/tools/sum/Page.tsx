import { useMemo, useState } from 'react'

export default function Page(){
  const [text, setText] = useState('1 2 3 4 5')
  const out = useMemo(()=>{
    const nums = text.split(/[\s,;]+/).filter(Boolean).map(Number)
    if (nums.some(n=>Number.isNaN(n))) return '包含非数字项'
    const sum = nums.reduce((s,n)=>s+n,0)
    const avg = nums.length ? sum/nums.length : 0
    const min = Math.min(...nums)
    const max = Math.max(...nums)
    return `数量: ${nums.length}\n和: ${sum}\n均值: ${avg}\n最小: ${min}\n最大: ${max}`
  }, [text])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <textarea className="textarea h-48" value={text} onChange={e=>setText(e.target.value)} />
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{out}</pre>
    </div>
  )
}
