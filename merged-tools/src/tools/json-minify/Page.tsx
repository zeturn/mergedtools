import { useState } from 'react'

export default function Page(){
  const [inJ, setInJ] = useState('')
  const [out, setOut] = useState('')
  function run(){ try{ setOut(JSON.stringify(JSON.parse(inJ))) }catch(e:any){ setOut('错误: '+(e?.message||'无效 JSON')) } }
  return (
    <div className="space-y-3">
      <textarea className="w-full h-64 rounded bg-slate-800 p-2 font-mono" value={inJ} onChange={(e)=>setInJ(e.target.value)} />
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={run}>压缩</button>
        <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={()=>setInJ('')}>清空</button>
      </div>
      <pre className="rounded bg-slate-900 p-2 font-mono break-words">{out}</pre>
    </div>
  )
}
