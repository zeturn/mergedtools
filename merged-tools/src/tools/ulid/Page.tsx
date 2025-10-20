import { useState } from 'react'
import { ulid } from 'ulid'

export default function Page() {
  const [id, setId] = useState('')
  function gen() { setId(ulid()) }
  function tsFromUlid(u: string) { try { const crock = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; let x = 0n; for (let i=0;i<10;i++){ x = x*32n + BigInt(crock.indexOf(u[i])); } return Number(x) } catch { return null } }
  const ts = id ? tsFromUlid(id) : null
  return (
    <div className="space-y-3">
      <button className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600" onClick={gen}>生成</button>
      <div className="rounded bg-slate-900 p-2 font-mono break-all select-all">{id || '点击生成'}</div>
      {ts !== null && <div className="text-sm text-slate-400">时间戳: {new Date(ts).toISOString()}</div>}
    </div>
  )
}
