import { useState } from 'react'

function hex(b: number){ return b.toString(16).padStart(2,'0') }

export default function Page(){
  const [prefix, setPrefix] = useState('')
  function gen(){
    const bytes = new Uint8Array(5)
    crypto.getRandomValues(bytes)
    const gid = Array.from(bytes).map(hex).join('') // 40-bit Global ID
    const pref = 'fd' + gid.slice(0,2) + ':' + gid.slice(2,6) + ':' + gid.slice(6,10) + '::'
    setPrefix(pref + '/48')
  }
  return (
    <div className="space-y-3">
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={gen}>生成 ULA /48</button>
      {prefix && (
        <div className="space-y-2">
          <div className="rounded bg-slate-900 p-2 font-mono">{prefix}</div>
          <div className="text-sm text-slate-400">示例主机地址</div>
          <div className="rounded bg-slate-900 p-2 font-mono">{prefix.replace('/48','').replace('::','::1')}</div>
        </div>
      )}
    </div>
  )
}
