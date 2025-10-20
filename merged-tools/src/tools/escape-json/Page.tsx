import { useMemo, useState } from 'react'

function escapeJSON(s: string){
  return JSON.stringify(s)
}
function unescapeJSON(s: string){
  try{
    const v = JSON.parse(s)
    return typeof v === 'string' ? v : '输入应为 JSON 字符串字面量'
  }catch(e:any){
    return e.message || String(e)
  }
}

export default function Page(){
  const [text, setText] = useState('"\\n" 会被转义')
  const [mode, setMode] = useState<'escape'|'unescape'>('escape')
  const out = useMemo(()=> mode==='escape' ? escapeJSON(text) : unescapeJSON(text), [text, mode])
  return (
    <div className="space-y-3">
      <textarea className="textarea h-40" value={text} onChange={e=>setText(e.target.value)} />
      <select className="input" value={mode} onChange={e=>setMode(e.target.value as any)}>
        <option value="escape">转义</option>
        <option value="unescape">反转义</option>
      </select>
      <pre className="rounded bg-slate-800 p-3 font-mono text-sm whitespace-pre-wrap break-words">{String(out)}</pre>
    </div>
  )
}
